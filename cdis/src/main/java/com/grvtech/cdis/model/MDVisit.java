/**
 * 
 */
package com.grvtech.cdis.model;


import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;

import com.grvtech.cdis.util.Misc;

/**
 * @author radu
 *
 */
public class MDVisit {
	
	
	private Values sbp;
	private Values dbp;
	private Values weight;
	private Values smoke;
	private Values aer;
	private Values hipo;
	private Values acglumd;
	private Values pcglumd;
	private Values neuromd;
	private Values psyco;
	private Values depr;
	private Values height;
	private Values foot;
	private Values rpathscr;
	
	public MDVisit(Values sbp, Values dbp, Values weight, Values smoke, Values aer,
			Values hipo, Values acglu, Values pcglu, Values neuro, Values psyco,
			Values depr, Values height, Values foot, Values rpathscr) {
		super();
		this.sbp = sbp;
		this.dbp = dbp;
		this.weight = weight;
		this.smoke = smoke;
		this.aer = aer;
		this.hipo = hipo;
		this.acglumd = acglu;
		this.pcglumd = pcglu;
		this.neuromd = neuro;
		this.psyco = psyco;
		this.depr = depr;
		this.height = height;
		this.foot = foot;
		this.rpathscr = rpathscr;
	}

	
	public MDVisit(HashMap<String, Values> map) {
		super();
		this.sbp = map.get("sbp");
		this.dbp = map.get("dbp");
		this.weight = map.get("weight");
		this.smoke = map.get("smoke");
		this.aer = map.get("aer");
		this.hipo = map.get("hipo");
		this.acglumd = map.get("acglumd");
		this.pcglumd = map.get("pcglumd");
		this.neuromd = map.get("neuromd");
		this.psyco = map.get("psyco");
		this.depr = map.get("depr");
		this.height = map.get("height");
		this.foot = map.get("foot");
		this.rpathscr = map.get("rpathscr");
	}

	public HashMap<String, Value> getLatestMDVisit(){
		HashMap<String, Value> result = new HashMap<String, Value>();
		result.put("sbp",this.sbp.getLastValue());
		result.put("dbp",this.dbp.getLastValue());
		result.put("weight",this.weight.getLastValue());
		result.put("smoke",this.smoke.getLastValue());
		result.put("aer",this.aer.getLastValue());
		result.put("hipo",this.hipo.getLastValue());
		result.put("acglumd",this.acglumd.getLastValue());
		result.put("pcglumd",this.pcglumd.getLastValue());
		result.put("neuromd",this.neuromd.getLastValue());
		result.put("psyco",this.psyco.getLastValue());
		result.put("depr",this.depr.getLastValue());
		result.put("height",this.height.getLastValue());
		result.put("foot",this.foot.getLastValue());
		result.put("rpathscr",this.rpathscr.getLastValue());
		return result;
	}
	
	
	public Values getRpathscr() {
		return rpathscr;
	}

	public void setRpathscr(Values rpathscr) {
		this.rpathscr = rpathscr;
	}
	
	public Values getAcglumd() {
		return acglumd;
	}

	public void setAcglumd(Values acglumd) {
		this.acglumd = acglumd;
	}

	public Values getPcglumd() {
		return pcglumd;
	}

	public void setPcglumd(Values pcglumd) {
		this.pcglumd = pcglumd;
	}

	public Values getNeuromd() {
		return neuromd;
	}

	public void setNeuromd(Values neuromd) {
		this.neuromd = neuromd;
	}

	public Values getFoot() {
		return foot;
	}

	public void setFoot(Values foot) {
		this.foot = foot;
	}

	public Values getSbp() {
		return sbp;
	}

	public void setSbp(Values sbp) {
		this.sbp = sbp;
	}
	public Values getDbp() {
		return dbp;
	}
	public void setDbp(Values dbp) {
		this.dbp = dbp;
	}
	public Values getWeight() {
		return weight;
	}
	public void setWeight(Values weight) {
		this.weight = weight;
	}

	public Values getSmoke() {
		return smoke;
	}

	public void setSmoke(Values smoke) {
		this.smoke = smoke;
	}

	public Values getAer() {
		return aer;
	}


	public void setAer(Values aer) {
		this.aer = aer;
	}

	public Values getHipo() {
		return hipo;
	}

	public void setHipo(Values hipo) {
		this.hipo = hipo;
	}

	public Values getAcglu() {
		return acglumd;
	}

	public void setAcglu(Values acglu) {
		this.acglumd = acglu;
	}

	public Values getPcglu() {
		return pcglumd;
	}

	public void setPcglu(Values pcglu) {
		this.pcglumd = pcglu;
	}

	public Values getNeuro() {
		return neuromd;
	}

	public void setNeuro(Values neuro) {
		this.neuromd = neuro;
	}

	public Values getPsyco() {
		return psyco;
	}

	public void setPsyco(Values psyco) {
		this.psyco = psyco;
	}

	public Values getDepr() {
		return depr;
	}

	public void setDepr(Values depr) {
		this.depr = depr;
	}

	public Values getHeight() {
		return height;
	}

	public void setHeight(Values height) {
		this.height = height;
	}

}
