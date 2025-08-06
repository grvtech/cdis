package com.grvtech.cdis.model;

import com.grvtech.cdis.db.CdisDBridge;

public class Hcp {
	private String casem;
	private String md;
	private String nut;
	private String nur;
	private String chr;
	private String idpatient;
	
	
	
	public Hcp(String casem, String md,String nut, String nur, String chr, String idpatient) {
		this.casem =casem;
		this.md=md;
		this.nut = nut;
		this.nur = nur;
		this.chr = chr;
		this.idpatient = idpatient;
	}

	public String getCasem() {
		return casem;
	}

	public void setCasem(String casem) {
		this.casem = casem;
	}

	public String getMd() {
		return md;
	}

	public void setMd(String md) {
		this.md = md;
	}

	public String getNut() {
		return nut;
	}

	public void setNut(String nut) {
		this.nut = nut;
	}

	public String getNur() {
		return nur;
	}

	public void setNur(String nur) {
		this.nur = nur;
	}

	public String getChr() {
		return chr;
	}

	public void setChr(String chr) {
		this.chr = chr;
	}

	public String getIdpatient() {
		return idpatient;
	}

	public void setIdpatient(String idpatient) {
		this.idpatient = idpatient;
	}

	public Hcp() {
		// TODO Auto-generated constructor stub
	}

	public static Hcp getHcp(String idpatient) {
		CdisDBridge db = new CdisDBridge();
		return db.getHcpById(idpatient);
	}
	
}
