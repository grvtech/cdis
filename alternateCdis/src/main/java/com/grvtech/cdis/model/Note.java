package com.grvtech.cdis.model;

import java.util.HashMap;

public class Note {
	private String idnote;
	private String note;
	private String notedate;
	private String iduser;
	private String idpatient;
	private String active;
	private String iduserto;
	private String viewed;
	
	
	public Note(){}
	
	public Note(String idnote, String note, String notedate, String iduser, String idpatient, String active, String iduserto, String viewed){
		this.idnote = idnote;
		this.note = note;
		this.notedate = notedate;
		this.iduser = iduser;
		this.idpatient = idpatient;
		this.active = active;
		this.iduserto = iduserto;
		this.viewed = viewed;
		
	}
	
	public Note(HashMap<String, String> map){
		this.idnote = map.get("idnote");
		this.note = map.get("note");
		this.notedate = map.get("notedate");
		this.iduser = map.get("iduser");
		this.idpatient = map.get("idpatient");
		this.active = map.get("active");
		this.iduserto = map.get("iduserto");
		this.viewed = map.get("viewed");
		
	}

	public String getIdnote() {
		return idnote;
	}

	public void setIdnote(String idnote) {
		this.idnote = idnote;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public String getNotedate() {
		return notedate;
	}

	public void setNotedate(String notedate) {
		this.notedate = notedate;
	}

	public String getIduser() {
		return iduser;
	}

	public void setIduser(String iduser) {
		this.iduser = iduser;
	}

	public String getIdpatient() {
		return idpatient;
	}

	public void setIdpatient(String idpatient) {
		this.idpatient = idpatient;
	}

	public String getActive() {
		return active;
	}

	public void setActive(String active) {
		this.active = active;
	}

	public String getIduserto() {
		return iduserto;
	}

	public void setIduserto(String iduserto) {
		this.iduserto = iduserto;
	}

	public String getViewed() {
		return viewed;
	}

	public void setViewed(String viewed) {
		this.viewed = viewed;
	}
	
	
	
}
