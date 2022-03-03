package com.grvtech.cdis.model;

import java.util.Date;

import com.grvtech.cdis.db.ChbDBridge;

public class Event {
	private int idevent=0;
	private int idaction=0;
	private int idsystem =0;
	private String iduser;
	private String idsession;
	private  Date created = new Date();
	private String data;
	
	
	
	
	public int getIdevent() {
		return idevent;
	}


	public void setIdevent(int idevent) {
		this.idevent = idevent;
	}


	public int getIdaction() {
		return idaction;
	}


	public void setIdaction(int idaction) {
		this.idaction = idaction;
	}


	public int getIdsystem() {
		return idsystem;
	}


	public void setIdsystem(int idsystem) {
		this.idsystem = idsystem;
	}


	public String getIduser() {
		return iduser;
	}


	public void setIduser(String iduser) {
		this.iduser = iduser;
	}

	

	public String getIdsession() {
		return idsession;
	}


	public void setIdsession(String idsession) {
		this.idsession = idsession;
	}


	public  Date getCreated() {
		return created;
	}


	public void setCreated(Date created) {
		this.created = created;
	}


	public Event(int idevent, String iduser, int idaction, int idsystem,String idsession, Date crea, String data){
		this.idevent = idevent;
		this.idaction = idaction;
		this.idsystem = idsystem;
		this.iduser = iduser;
		this.idsession = idsession;
		this.created = crea;
		this.data = data;
		
	}
	
}
