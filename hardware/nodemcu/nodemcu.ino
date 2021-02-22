// Based on https://github.com/n0w/esp8266-simple-sniffer

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include "sdk_structs.h"
#include "ieee80211_structs.h"

#define LED D1
bool probe = false;
int channel_samples = 0;
unsigned int channel = 1;

extern "C"
{
#include "user_interface.h"
}

void startupBlink () {
  for (int i = 0; i < 5; i++) {  
    digitalWrite(LED, HIGH);
    Serial.println("Blink");
    delay(300);
    digitalWrite(LED, LOW);
    delay(300);
  }
}

void setup () {
  pinMode(LED, OUTPUT);

  startupBlink();

  Serial.begin(115200);
  delay(10);
  wifi_set_channel(channel);
  wifi_set_opmode(STATION_MODE);
  wifi_promiscuous_enable(0);
  WiFi.disconnect();
  wifi_set_promiscuous_rx_cb(onPacket);
  wifi_promiscuous_enable(1);
}

void onPacket (uint8_t *buff, uint16_t len) {
  const wifi_promiscuous_pkt_t *ppkt = (wifi_promiscuous_pkt_t *)buff;
  const wifi_ieee80211_packet_t *ipkt = (wifi_ieee80211_packet_t *)ppkt->payload;
  const wifi_ieee80211_mac_hdr_t *hdr = &ipkt->hdr;
  const uint8_t *data = ipkt->payload;
  const wifi_header_frame_control_t *frame_ctrl = (wifi_header_frame_control_t *)&hdr->frame_ctrl;

  // Log probe requests
  if (frame_ctrl->type == WIFI_PKT_MGMT && frame_ctrl->subtype == PROBE_REQ) {
    Serial.println("Probe Request detected");
    probe = true;
  }
}

void loop () {
  channel = 1;
  wifi_set_channel(channel);
  while (true) {
    channel_samples++;

    if (probe == true) {
      probe = false;
      digitalWrite(LED, HIGH);
      Serial.println("Blink");
      delay(300);
      digitalWrite(LED, LOW);
      delay(10);
    }

    if (channel_samples > 200) {
      channel_samples = 0;
      channel++;
      if (channel == 15) break;
      wifi_set_channel(channel);
    }
  }
  delay(10);
}
