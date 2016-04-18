package com.coretree.interfaces;

import com.coretree.models.SmsData;
import com.coretree.models.UcMessage;

public interface ITelStatusService  {
	void RequestToPbx(UcMessage msg);
	void SendSms(SmsData msg);
}
