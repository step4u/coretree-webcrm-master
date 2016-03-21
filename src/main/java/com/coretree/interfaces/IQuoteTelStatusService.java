package com.coretree.interfaces;

import com.coretree.models.SmsMsg;
import com.coretree.models.UcMessage;

public interface IQuoteTelStatusService  {
	void RequestToPbx(UcMessage msg);
	void SendSms(SmsMsg msg);
}
