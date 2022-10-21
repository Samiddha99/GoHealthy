#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>  //For ESP8266
#include <ArduinoHttpClient.h>
#include <HttpClient.h>  //For Arduino
#include <ArduinoJson.h>
#include <WiFiClientSecure.h>  //Include the SSL client
#include <LiquidCrystal.h> //Library for LCD

char ssid[] = "XXXX";       // your network SSID (name)
char password[] = "YYYY";  // your network key

const int httpPort = 443; // 80 is for HTTP / 443 is for HTTPS!

const int rs = 12, en = 11, d4 = 5, d5 = 4, d6 = 3, d7 = 2;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);

int pressureSensor = A5; //Pressure Sensor is connected to Analog Pin 5
int flowSensor = A4 //Flow Messure Sensor is connected to Analog pin 4

float pressure = 0;
float flow = 0;

char hospitalId[] = "";
char authToken[] = "";
char tankConstant[] = "";

String json;  //Store the json formated value

char url[] = "https://go-healthy.herokuapp.com/update-oxygen/";

//SSL certificate of the site
char root_ca = "-----BEGIN CERTIFICATE-----\n" \
"MIIF1TCCBL2gAwIBAgIQBhPlQHhJ0zsSJZrt5Kz28jANBgkqhkiG9w0BAQsFADBG\n" \
"MQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRUwEwYDVQQLEwxTZXJ2ZXIg\n" \
"Q0EgMUIxDzANBgNVBAMTBkFtYXpvbjAeFw0yMTA1MjkwMDAwMDBaFw0yMjA2Mjcy\n" \
"MzU5NTlaMBoxGDAWBgNVBAMMDyouaGVyb2t1YXBwLmNvbTCCASIwDQYJKoZIhvcN\n" \
"AQEBBQADggEPADCCAQoCggEBAJ0vqsbsP1Z9l1Nj6Ha1b6hcbmh476d3IYckcU3C\n" \
"KTIX2DmofM9WC6UAohH22IG11n8B6HjOEr8C1c9ZV6B+VsxGbJ5kwc0B9KERtnm+\n" \
"t+ejvykCwM+A/BzI/quOqxjCq0p9ODikcwzTrfaHj9tNihHsLnwP50GVy9GPL2DM\n" \
"49ErQy+A/0E7E0IeEinzx5rVLfAXjVIvgJkohBPKGDrAnx82aGvfH5MX2dS403pj\n" \
"jtsiBXNNBYBZq8kx5/4/MP01C6sWf26FndEMHmdI5ATjm/DIeUsGWm+T3dp1SvfO\n" \
"gXwTHFBUtuJ7/to8aM1yr9NwzY+ZUR7IhfS/1a8Kz5ktdXkCAwEAAaOCAukwggLl\n" \
"MB8GA1UdIwQYMBaAFFmkZgZSoHuVkjyjlAcnlnRb+T3QMB0GA1UdDgQWBBQeOKGY\n" \
"IAy6+v+1nPBklOOJSBHmkTAaBgNVHREEEzARgg8qLmhlcm9rdWFwcC5jb20wDgYD\n" \
"VR0PAQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjA7BgNV\n" \
"HR8ENDAyMDCgLqAshipodHRwOi8vY3JsLnNjYTFiLmFtYXpvbnRydXN0LmNvbS9z\n" \
"Y2ExYi5jcmwwEwYDVR0gBAwwCjAIBgZngQwBAgEwdQYIKwYBBQUHAQEEaTBnMC0G\n" \
"CCsGAQUFBzABhiFodHRwOi8vb2NzcC5zY2ExYi5hbWF6b250cnVzdC5jb20wNgYI\n" \
"KwYBBQUHMAKGKmh0dHA6Ly9jcnQuc2NhMWIuYW1hem9udHJ1c3QuY29tL3NjYTFi\n" \
"LmNydDAMBgNVHRMBAf8EAjAAMIIBfwYKKwYBBAHWeQIEAgSCAW8EggFrAWkAdwAp\n" \
"eb7wnjk5IfBWc59jpXflvld9nGAK+PlNXSZcJV3HhAAAAXm2grdrAAAEAwBIMEYC\n" \
"IQDqagXjdXfYQRpE5kfI4ZIMajPvyBzGcmfWT5Xv/oRsRwIhAKmKKs1UMcQv4Iuq\n" \
"k+EyFa/Q5bTcTc27wOqGbzYCKcDdAHYAIkVFB1lVJFaWP6Ev8fdthuAjJmOtwEt/\n" \
"XcaDXG7iDwIAAAF5toK3lwAABAMARzBFAiBZqC7l0x9dSJ5TGU33m+a5SnJJ7Irf\n" \
"p2OnLYrPQ6mQdQIhAMTIiSn58YUrtAGPlYk6+M27eOVlrfbyr9tL3dUK4F/HAHYA\n" \
"UaOw9f0BeZxWbbg3eI8MpHrMGyfL956IQpoN/tSLBeUAAAF5toK3vwAABAMARzBF\n" \
"AiAOKo/odm2ZApG9nldCKbCenSSI80qbcUMuJXzT2NGLMgIhAK1hJCxegiXOIvnp\n" \
"FXNvxCFOpmQRTZdB7BwWGXyrflD8MA0GCSqGSIb3DQEBCwUAA4IBAQB/B6ribW0e\n" \
"piCVu4ROIlg5ZZ9edVYi7hJWTE/D6G6r55BmKT0YoEoGC3P3jFLB2Kjp7RTRsWLq\n" \
"I3BA+Zy8O3GlFph77T/cfvr431ehZp954Z11PUYhcdhV2lt/k+dngYbqSqPhjrEd\n" \
"5kKXzfavRZcVyRCqc/mPPi9laaErGdUHVu16fFOKCIW1EoU77gbHbY7vU+R8eBEf\n" \
"mxQoCnCKlh8TSFZ+bDSUJHvsT/mHmAUiGe8HMF7uYomDgYZ3MI0x7k/Ennfdcl3J\n" \
"DLFEIEfXQGtXiGAIOqGOhk50iyznoR/CExY+gh3AmRfkVS6HiYC723x1FdzB3Xps\n" \
"8hwm4FeccLYy\n" \
"-----END CERTIFICATE-----\n";

char check1[] = "";
char check2[] = "";

void setup() {
	Serial.begin(9600);  //  setup serial
	Serial.println();
	lcd.begin(16, 2);  // set up the LCD's number of columns and rows
	WiFi.begin(ssid, password);  //Connect to WiFi
	delay(10000);
	lcd.print("WiFi Connected");
}

void loop() {
	while (WiFi.status() != WL_CONNECTED) {  //If WiFi not connected
		lcd.print("\n");
		lcd.print("WiFi Connection Failed \n");
		lcd.print("Re-connecting.... \n");

		WiFi.begin(ssid, password);  //Connect to WiFi
		delay(10000);
		if(WiFi.status() == WL_CONNECTED) {  //if WiFi connect succeeded
			lcd.print("WiFi Connected");
			break;
		}
	}

	// Prepare JSON document
	DynamicJsonDocument doc(2048);
	
	HTTPClient http;
	
	pressure = analogRead(pressureSensor);
	flow = analogRead(flowSensor);
	
	if((check1 != pressure) || (check2 != flow))
	{
		check1 = pressure;
		check2 = flow
		/*
		WiFiClientSecure client; //Add a SSL client
		client.setInsecure(); // this is the magical line that makes everything work
		
		if (!client.connect(host, httpPort)) { //works!
			Serial.println("connection failed");
			return;
		} */
		
		doc["Oxygen_Pressure"] = pressure;
		doc["Oxygen_Flow"] = flow;
		doc["Tank_Conversion_Factor"] = tankConstant;
		
		serializeJson(doc, json);  // Serialize JSON document

		// Send request
		http.begin(url, root_ca);
		
		//add Headers with request
		http.addHeader("Content-Type", "application/json; charset=utf-8");
		http.addHeader("Auth_Key", authToken);
		http.addHeader("Hospital_Id", hospitalId);
		
		int httpSend = http.POST(json);
		
		//Read response code
		String responseCode = "HTTP Response Code: " + httpSend + "\n\nPressure: " + pressure + "PSI \nFlow Rate: " + flow + "Litre/Minute\n";
		lcd.print(responseCode)
		Serial.println(responseCode);

		// Read response
		Serial.println(http.getString());

		// Disconnect
		http.end();
		
		delay(5000); //Wait for 5 seconds
	}
}
