package com.grvtech.cdis.model;

public class SearchPatient {
	private String firstname;
	private String lastname;
	private String ramq;
	private String community;
	private int chart;
	private int idpatient;
	private String giu;
	
	
	public SearchPatient(String firstname, String lastname, String ramq,String community, int chart, int idpatient, String giu) {
		super();
		this.firstname = firstname;
		this.lastname = lastname;
		this.ramq = ramq;
		this.community = community;
		this.chart = chart;
		this.idpatient=idpatient;
		this.giu = giu;
	}



	public int getIdpatient() {
		return idpatient;
	}



	public void setIdpatient(int idpatient) {
		this.idpatient = idpatient;
	}



	public String getFirstname() {
		return firstname;
	}



	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}



	public String getLastname() {
		return lastname;
	}



	public void setLastname(String lastname) {
		this.lastname = lastname;
	}



	public String getRamq() {
		return ramq;
	}



	public void setRamq(String ramq) {
		this.ramq = ramq;
	}



	public String getCommunity() {
		return community;
	}



	public void setCommunity(String community) {
		this.community = community;
	}



	public int getChart() {
		return chart;
	}



	public void setChart(int chart) {
		this.chart = chart;
	}
	
	
	public String getGiu() {
		return giu;
	}



	public void setGiu(String giu) {
		this.giu = giu;
	}
	
	
	
	
}
