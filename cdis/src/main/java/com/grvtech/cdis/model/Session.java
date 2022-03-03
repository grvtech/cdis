package com.grvtech.cdis.model;

import com.grvtech.cdis.db.ChbDBridge;

public class Session {
	private String idsession;
	private String iduser;
	private String ipuser;
	private long created;
	private long modified;
	private int reswidth;
	private int resheight;
	private int active;
	
	
	
	public Session() {
		this.idsession="0";
	}
	
	
	public int getActive() {
		return active;
	}



	public void setActive(int active) {
		this.active = active;
	}



	public long getModified() {
		return modified;
	}



	public void setModified(long modified) {
		this.modified = modified;
	}



	public int getReswidth() {
		return reswidth;
	}



	public void setReswidth(int reswidth) {
		this.reswidth = reswidth;
	}



	public int getResheight() {
		return resheight;
	}



	public void setResheight(int resheight) {
		this.resheight = resheight;
	}



	public Session(String idsession, String iduser, String ipuser,
			long created, long modified, int reswidth, int resheight,int active) {
		super();
		this.idsession = idsession;
		this.iduser = iduser;
		this.ipuser = ipuser;
		this.created = created;
		this.modified = modified;
		this.reswidth = reswidth;
		this.resheight = resheight;
		this.active = active;
	}



	public String getIdsession() {
		return idsession;
	}

	public void setIdsession(String idsession) {
		this.idsession = idsession;
	}

	public String getIduser() {
		return iduser;
	}

	public void setIduser(String iduser) {
		this.iduser = iduser;
	}

	public String getIpuser() {
		return ipuser;
	}

	public void setIpuser(String ipuser) {
		this.ipuser = ipuser;
	}

	public long getCreated() {
		return created;
	}

	public void setCreated(long created) {
		this.created = created;
	}

	public Session getSession(){
		return this;
	}
	
	
}
