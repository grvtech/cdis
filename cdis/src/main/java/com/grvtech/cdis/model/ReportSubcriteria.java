package com.grvtech.cdis.model;

import com.grvtech.cdis.db.CdisDBridge;

public class ReportSubcriteria {
	
	private String subname = null;
	private String suboperator = null;
	private String subdisplay = null;
	private String subvalue = null;
	private String subsection = null;
	private String subiddata = null;
	
	public String getSubname() {
		return subname;
	}
	public void setSubname(String subname) {
		this.subname = subname;
	}
	public String getSuboperator() {
		return suboperator;
	}
	public void setSuboperator(String suboperator) {
		this.suboperator = suboperator;
	}
	public String getSubdisplay() {
		return subdisplay;
	}
	public void setSubdisplay(String subdisplay) {
		this.subdisplay = subdisplay;
	}
	public String getSubvalue() {
		if(subvalue.indexOf("and") >= 0){
			String tsubvalue = "";
			subvalue = subvalue.replaceAll("\'","");
			String[] parts = subvalue.split("and");
			for(int i=0;i<parts.length;i++){
				String part = parts[i];
				if (i == parts.length-1){
					tsubvalue += part.trim();
				}else{
					tsubvalue += part.trim()+ "' and '";
				}
			}
			subvalue = tsubvalue;
		}
		return subvalue;
	}
	public void setSubvalue(String subvalue) {
		this.subvalue = subvalue;
	}
	public String getSubsection() {
		return subsection;
	}
	public void setSubsection(String subsection) {
		this.subsection = subsection;
	}
	public String getSubiddata() {
		return subiddata;
	}
	public void setSubiddata(String subiddata) {
		this.subiddata = subiddata;
	}
	
	public void loadIddata(){
		CdisDBridge db = new CdisDBridge();
		this.subiddata = db.getIddata(this.subname);
	}
	
}
