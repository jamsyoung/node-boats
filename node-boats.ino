int led = D1;
int servoPin = A0;
Servo myservo;

int motorDirectionPin = D2;
int motorSpeedPin = D0;
int motorSpeed(String speed);
int motorDirection(String forward);
int direction(String angle);
int forward(String f);
int servoAttached(String args);


void setup() {

    pinMode(led, OUTPUT);
    pinMode(servoPin, OUTPUT);
    pinMode(motorDirectionPin, OUTPUT);
    pinMode(motorSpeedPin, OUTPUT);

    myservo.attach(servoPin);

    Spark.function("motorSpeed", motorSpeed);
    Spark.function("angle", direction);
}

int motorSpeed(String speed)
{
    int s = speed.toInt();
    int v = -1;
    if(s >= 0)  //we are going forward
    {
        //set the direciton to forward
        digitalWrite(motorDirectionPin, LOW);
        analogWrite(motorSpeedPin, s);
    }
    else
    {
         //set the direciton to reverse
        digitalWrite(motorDirectionPin, HIGH);
        v = s*-1;
        analogWrite(motorSpeedPin, v);
        return v;
    }

    return s;
}

int direction(String angle)
{
    int a = angle.toInt();
    myservo.write(a);
    delay(15);  //wait for the servo to move before we move on

    return a;
}

void loop() {

}
