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
public class Miscellaneous {

	private Values dophta;
	private Values dinflu;
	private Values dpneu;
	private Values dppd;
	private Values ppd;
	private Values inh;
	public Miscellaneous(Values dateophta, Values dateinfluenza, Values datepneu,
			Values dateppd, Values ppd, Values inh) {
		super();
		this.dophta = dateophta;
		this.dinflu = dateinfluenza;
		this.dpneu = datepneu;
		this.dppd = dateppd;
		this.ppd = ppd;
		this.inh = inh;
	}
	
	public Miscellaneous(HashMap<String, Values> map) {
		super();
		this.dophta = map.get("dophta");
		this.dinflu = map.get("dinflu");
		this.dpneu = map.get("dpneu");
		this.dppd = map.get("dppd");
		this.ppd = map.get("ppd");
		this.inh = map.get("inh");
	}
	
	public HashMap<String, Value> getLatestMiscellaneous(){
		HashMap<String, Value> result = new HashMap<String, Value>();
		result.put("dophta",this.dophta.getLastValue());
		result.put("dinflu",this.dinflu.getLastValue());
		result.put("dpneu",this.dpneu.getLastValue());
		result.put("dppd",this.dppd.getLastValue());
		result.put("ppd",this.ppd.getLastValue());
		result.put("inh",this.inh.getLastValue());
		return result;
	}
	
	public Values getDophta() {
		return dophta;
	}

	public void setDophta(Values dophta) {
		this.dophta = dophta;
	}

	public Values getDinflu() {
		return dinflu;
	}

	public void setDinflu(Values dinflu) {
		this.dinflu = dinflu;
	}

	public Values getDpneu() {
		return dpneu;
	}

	public void setDpneu(Values dpneu) {
		this.dpneu = dpneu;
	}

	public Values getDppd() {
		return dppd;
	}

	public void setDppd(Values dppd) {
		this.dppd = dppd;
	}

	public Values getDateophta() {
		return dophta;
	}
	public void setDateophta(Values dateophta) {
		this.dophta = dateophta;
	}
	public Values getDateinfluenza() {
		return dinflu;
	}
	public void setDateinfluenza(Values dateinfluenza) {
		this.dinflu = dateinfluenza;
	}
	public Values getDatepneu() {
		return dpneu;
	}
	public void setDatepneu(Values datepneu) {
		this.dpneu = datepneu;
	}
	public Values getDateppd() {
		return dppd;
	}
	public void setDateppd(Values dateppd) {
		this.dppd = dateppd;
	}
	public Values getPpd() {
		return ppd;
	}
	public void setPpd(Values ppd) {
		this.ppd = ppd;
	}
	public Values getInh() {
		return inh;
	}
	public void setInh(Values inh) {
		this.inh = inh;
	}
	

}
