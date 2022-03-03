
package com.grvtech.cdis.model;


import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;

import com.grvtech.cdis.util.Misc;

/**
 * @author radu
 *
 */
public class Lipid {
	private Values tchol;
	private Values hdl;
	private Values ldl;
	private Values tglycer;
	private Values tchdl;
	public Lipid(Values tchol, Values hdl, Values ldl, Values tglycer, Values tchdl) {
		super();
		this.tchol = tchol;
		this.hdl = hdl;
		this.ldl = ldl;
		this.tglycer = tglycer;
		this.tchdl = tchdl;
	}
	
	public Lipid(HashMap<String, Values> map) {
		super();
		this.tchol = map.get("tchol");
		this.hdl = map.get("hdl");
		this.ldl = map.get("ldl");
		this.tglycer = map.get("tglycer");
		this.tchdl = map.get("tchdl");
	}
	
	public HashMap<String, Value> getLatestLipid(){
		HashMap<String, Value> result = new HashMap<String, Value>();
		result.put("tchol",this.tchol.getLastValue());
		result.put("hdl",this.hdl.getLastValue());
		result.put("ldl",this.ldl.getLastValue());
		result.put("tglycer",this.tglycer.getLastValue());
		result.put("tchdl",this.tchdl.getLastValue());
		return result;
	}
	
	
	public Values getTchol() {
		return tchol;
	}
	public void setTchol(Values tchol) {
		this.tchol = tchol;
	}
	public Values getHdl() {
		return hdl;
	}
	public void setHdl(Values hdl) {
		this.hdl = hdl;
	}
	public Values getLdl() {
		return ldl;
	}
	public void setLdl(Values ldl) {
		this.ldl = ldl;
	}
	public Values getTglycer() {
		return tglycer;
	}
	public void setTglycer(Values tglycer) {
		this.tglycer = tglycer;
	}
	public Values getTchdl() {
		return tchdl;
	}
	public void setTchdl(Values tchdl) {
		this.tchdl = tchdl;
	}
	

}
