import requests
from storages.utils import setting, get_available_overwrite_name

from django.core.files.storage import Storage
from django.conf import settings
from django.core.files import File
from django.utils.deconstruct import deconstructible
from django.utils.deconstruct import deconstructible

import dropbox
from dropbox.exceptions import ApiError
from dropbox.files import *

_DEFAULT_TIMEOUT = 100
_DEFAULT_MODE = 'add'

@deconstructible
class DropBoxStorage(Storage):
    CHUNK_SIZE = 4 * 1024 * 1024
    def __init__(self):
        self.DROPBOX_OAUTH2_ACCESS_TOKEN = setting('DROPBOX_OAUTH2_ACCESS_TOKEN')
        self.DROPBOX_OAUTH2_REFRESH_TOKEN = setting('DROPBOX_OAUTH2_REFRESH_TOKEN')
        self.DROPBOX_APP_KEY = setting('DROPBOX_APP_KEY')
        self.DROPBOX_APP_SECRET = setting('DROPBOX_APP_SECRET')
        self.DROPBOX_ROOT_PATH = setting('DROPBOX_ROOT_PATH')
        self.MEDIA_URL = setting('MEDIA_URL')
        self.timeout = setting('DROPBOX_TIMEOUT', _DEFAULT_TIMEOUT)
        self.write_mode = setting('DROPBOX_WRITE_MODE', _DEFAULT_MODE)
        self.dbx = dropbox.Dropbox(app_key=self.DROPBOX_APP_KEY, app_secret=self.DROPBOX_APP_SECRET, oauth2_refresh_token=self.DROPBOX_OAUTH2_REFRESH_TOKEN)
        self.dbx.users_get_current_account()
    def delete(self, name):
        path = f"{self.DROPBOX_ROOT_PATH}/{name}"
        self.dbx.files_delete_v2(path)
    def exists(self, name):
        try:
            path = f"{self.DROPBOX_ROOT_PATH}/{name}"
            return bool(self.dbx.files_get_metadata(path))
        except ApiError:
            return False
    def get_accessed_time(self, name):
        path = f"{self.DROPBOX_ROOT_PATH}/{name}"
        last_accessed = self.dbx.files_get_metadata(path).client_modified
        return last_accessed
    # def get_created_time(self, name):
    #     path = f"{self.DROPBOX_ROOT_PATH}/{name}"
    #     created_at = self.dbx.files_get_metadata(path).client_modified
    #     return created_at
    def get_modified_time(self, name):
        path = f"{self.DROPBOX_ROOT_PATH}/{name}"
        last_modified = self.dbx.files_get_metadata(path).server_modified
        return last_modified
    def size(self, name):
        path = f"{self.DROPBOX_ROOT_PATH}/{name}"
        metadata = self.dbx.files_get_metadata(path)
        return metadata.size
    def url(self, name):
        path = f"{self.DROPBOX_ROOT_PATH}/{name}"
        try:
            media = self.dbx.files_get_temporary_link(path)
            return media.link
        except ApiError:
            return None
    def listdir(self, path):
        directories, files = [], []
        path = f"{self.DROPBOX_ROOT_PATH}/{path}"
        metadata = self.dbx.files_list_folder(path)
        for entry in metadata.entries:
            if isinstance(entry, FolderMetadata):
                directories.append(entry.name)
            else:
                files.append(entry.name)
        return directories, files
    def _open(self, name, mode='rb'):
        full_file_url = self.url(name)
        response = requests.get(full_file_url)
        if (response.status_code == 200):
            data = response.text
            remote_file = File(data)
            return remote_file     
    def _save(self, name, content):
        path = f"{self.DROPBOX_ROOT_PATH}/{name}"
        content.open()
        if content.size <= self.CHUNK_SIZE:
            self.dbx.files_upload(content.read(), path, mode=WriteMode(self.write_mode))
        else:
            self._chunked_upload(content, path)
        content.close()
        return name
    def _chunked_upload(self, content, dest_path):
        upload_session = self.dbx.files_upload_session_start(content.read(self.CHUNK_SIZE))
        cursor = UploadSessionCursor(session_id=upload_session.session_id, offset=content.tell())
        commit = CommitInfo(path=dest_path, mode=WriteMode(self.write_mode))

        while content.tell() < content.size:
            if (content.size - content.tell()) <= self.CHUNK_SIZE:
                self.dbx.files_upload_session_finish(content.read(self.CHUNK_SIZE), cursor, commit)
            else:
                self.dbx.files_upload_session_append_v2(content.read(self.CHUNK_SIZE), cursor)
                cursor.offset = content.tell()
        

