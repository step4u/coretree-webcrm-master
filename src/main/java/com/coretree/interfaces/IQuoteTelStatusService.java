package com.coretree.interfaces;

import com.coretree.models.UcMessage;

public interface IQuoteTelStatusService  {
	void RequestToPbx(UcMessage msg);
	void MakeCall(UcMessage msg);
	void DropCall(UcMessage msg);
	void HoldCall(UcMessage msg);
	void ActiveCall(UcMessage msg);
	void Transfer(UcMessage msg);
	void PickUp(UcMessage msg);
	void ReqExtStatus(UcMessage msg);
}
