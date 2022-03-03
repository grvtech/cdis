package com.grvtech.cdis.model;


import java.util.HashMap;

/**
 * @author radu
 *
 */

public class Renal {
	private Values acratio;
	private Values prote;
	private Values crcl;
	private Values egfr;
	private Values crea;
	private Values pcr;
	private Values pcrg;
	public Renal(Values acratio, Values prote, Values crcl, Values egfr, Values crea, Values pcr, Values pcrg) {
		super();
		this.acratio = acratio;
		this.prote = prote;
		this.crcl = crcl;
		this.egfr = egfr;
		this.crea = crea;
		this.pcr = pcr;
		this.pcrg = pcrg;
		
	}
	
	public Renal(HashMap<String, Values> map) {
		super();
		this.acratio = map.get("acratio");
		this.prote = map.get("prote");
		this.crcl = map.get("crcl");
		this.egfr = map.get("egfr");
		this.crea = map.get("crea");
		this.pcr = map.get("pcr");
		this.pcrg = map.get("pcrg");
	}
	
	public HashMap<String, Value> getLatestRenal(){
		HashMap<String, Value> result = new HashMap<String, Value>();
		result.put("acratio",this.acratio.getLastValue());
		result.put("prote",this.prote.getLastValue());
		result.put("crcl",this.crcl.getLastValue());
		result.put("egfr",this.egfr.getLastValue());
		result.put("crea",this.crea.getLastValue());
		result.put("pcr",this.pcr.getLastValue());
		result.put("pcrg",this.pcrg.getLastValue());
		return result;
	}
	
	public Values getAcratio() {
		return acratio;
	}
	public void setAcratio(Values acratio) {
		this.acratio = acratio;
	}
	public Values getProte() {
		return prote;
	}
	public void setProte(Values prote) {
		this.prote = prote;
	}
	public Values getCrcl() {
		return crcl;
	}
	public void setCrcl(Values crcl) {
		this.crcl = crcl;
	}
	public Values getEgfr() {
		return egfr;
	}
	public void setEgfr(Values egfr) {
		this.egfr = egfr;
	}
	public Values getCrea() {
		return crea;
	}
	public void setCrea(Values crea) {
		this.crea = crea;
	}
	public Values getPcr() {
		return pcr;
	}
	public void setPcr(Values pcr) {
		this.pcr = pcr;
	}
	public Values getPcrg() {
		return pcrg;
	}
	public void setPcrg(Values pcrg) {
		this.pcrg = pcrg;
	}

}
