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
public class Complications {
	private Values reti;
	private Values lther;
	private Values lblind;
	private Values micro;
	private Values macro;
	private Values renf;
	private Values dial;
	private Values neuro;
	private Values fulcer;
	private Values amput;
	private Values impot;
	private Values cad;
	private Values cvd;
	private Values pvd;
	private Values rplant;
	
	public Complications(Values reti, Values lther, Values lblind, Values micro,
			Values macro, Values renf, Values dial, Values neuro, Values fulcer,
			Values amput, Values impot, Values cad, Values cvd, Values pvd, Values rplant) {
		super();
		this.reti = reti;
		this.lther = lther;
		this.lblind = lblind;
		this.micro = micro;
		this.macro = macro;
		this.renf = renf;
		this.dial = dial;
		this.neuro = neuro;
		this.fulcer = fulcer;
		this.amput = amput;
		this.impot = impot;
		this.cad = cad;
		this.cvd = cvd;
		this.pvd = pvd;
		this.rplant = rplant;
	}
	
	
	public Complications(HashMap<String, Values> map) {
		super();
		this.reti = map.get("reti");
		this.lther = map.get("lther");
		this.lblind = map.get("lblind");
		this.micro = map.get("micro");
		this.macro = map.get("macro");
		this.renf = map.get("renf");
		this.dial =map.get("dial");
		this.neuro = map.get("neuro");
		this.fulcer = map.get("fulcer");
		this.amput = map.get("amput");
		this.impot = map.get("impot");
		this.cad = map.get("cad");
		this.cvd = map.get("cvd");
		this.pvd = map.get("pvd");
		this.rplant = map.get("rplant");
	}
	
	
	public HashMap<String, Value> getLatestComplications(){
		HashMap<String, Value> result = new HashMap<String, Value>();
		result.put("reti",this.reti.getLastValue());
		result.put("lther",this.lther.getLastValue());
		result.put("lblind",this.lblind.getLastValue());
		result.put("micro",this.micro.getLastValue());
		result.put("macro",this.macro.getLastValue());
		result.put("renf",this.renf.getLastValue());
		result.put("dial",this.dial.getLastValue());
		result.put("neuro",this.neuro.getLastValue());
		result.put("fulcer",this.fulcer.getLastValue());
		result.put("amput",this.amput.getLastValue());
		result.put("impot",this.impot.getLastValue());
		result.put("cad",this.cad.getLastValue());
		result.put("cvd",this.cvd.getLastValue());
		result.put("pvd",this.pvd.getLastValue());
		result.put("rplant",this.rplant.getLastValue());
		return result;
	}
	
	public Values getReti() {
		return reti;
	}
	public void setReti(Values reti) {
		this.reti = reti;
	}
	public Values getLther() {
		return lther;
	}
	public void setLther(Values lther) {
		this.lther = lther;
	}
	public Values getLblind() {
		return lblind;
	}
	public void setLblind(Values lblind) {
		this.lblind = lblind;
	}
	public Values getMicro() {
		return micro;
	}
	public void setMicro(Values micro) {
		this.micro = micro;
	}
	public Values getMacro() {
		return macro;
	}
	public void setMacro(Values macro) {
		this.macro = macro;
	}
	public Values getRenf() {
		return renf;
	}
	public void setRenf(Values renf) {
		this.renf = renf;
	}
	public Values getDial() {
		return dial;
	}
	public void setDial(Values dial) {
		this.dial = dial;
	}
	public Values getNeuro() {
		return neuro;
	}
	public void setNeuro(Values neuro) {
		this.neuro = neuro;
	}
	public Values getFulcer() {
		return fulcer;
	}
	public void setFulcer(Values fulcer) {
		this.fulcer = fulcer;
	}
	public Values getAmput() {
		return amput;
	}
	public void setAmput(Values amput) {
		this.amput = amput;
	}
	public Values getImpot() {
		return impot;
	}
	public void setImpot(Values impot) {
		this.impot = impot;
	}
	public Values getCad() {
		return cad;
	}
	public void setCad(Values cad) {
		this.cad = cad;
	}
	public Values getCvd() {
		return cvd;
	}
	public void setCvd(Values cvd) {
		this.cvd = cvd;
	}
	public Values getPvd() {
		return pvd;
	}
	public void setPvd(Values pvd) {
		this.pvd = pvd;
	}
	public Values getRplant() {
		return rplant;
	}
	public void setRplant(Values rplant) {
		this.rplant = rplant;
	}
}
