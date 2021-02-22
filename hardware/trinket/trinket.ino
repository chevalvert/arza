#include <ProTrinketKeyboard.h>

void setup () {
  pinMode(12, INPUT);
  digitalWrite(12, LOW);

  TrinketKeyboard.begin();
}

boolean state = LOW;
boolean pstate = LOW;

void loop () {
  TrinketKeyboard.poll();

  state = digitalRead(12);

  if (pstate == LOW && state == HIGH) {
    TrinketKeyboard.pressKey(0, KEYCODE_P);
    TrinketKeyboard.pressKey(0, 0);
  }

  pstate = state;
}
