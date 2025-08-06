package com.grvtech.cdis.model;

public class Message {
	private String idmessage;
	private String from;
	private String to;
	private boolean read;
	private boolean delivered;
	private String date;
	private String message;
	
	
	
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getIdmessage() {
		return idmessage;
	}
	public void setIdmessage(String idmessage) {
		this.idmessage = idmessage;
	}
	public String getFrom() {
		return from;
	}
	public void setFrom(String from) {
		this.from = from;
	}
	public String getTo() {
		return to;
	}
	public void setTo(String to) {
		this.to = to;
	}
	public boolean isRead() {
		return read;
	}
	public void setRead(boolean read) {
		this.read = read;
	}
	public boolean isDelivered() {
		return delivered;
	}
	public void setDelivered(boolean delivered) {
		this.delivered = delivered;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public Message(String idmessage, String from, String to, boolean read,
			boolean delivered, String date, String message) {
		super();
		this.idmessage = idmessage;
		this.from = from;
		this.to = to;
		this.read = read;
		this.delivered = delivered;
		this.date = date;
		this.message = message;
	}

	
	
	
}
