/**
 * 
 */
package com.grvtech.cdis.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

import com.grvtech.cdis.util.Misc;

/**
 * @author radu
 *
 */
public class Diabet {
	private Values dtype;

	public Diabet(HashMap<String, Values> map) {
		super();
		this.dtype = map.get("dtype");
	}
	
	public HashMap<String, Value> getLatestDiabet(){
		HashMap<String, Value> result = new HashMap<String, Value>();
		result.put("dtype",this.dtype.getLastValue());
		return result;
	}
	
	
	public Diabet(Values type) {
		super();
		this.dtype = type;
	}
	
	public Values getType() {
		return dtype;
	}

	public void setType(Values type) {
		this.dtype = type;
	}

	public Values getDtype() {
		return dtype;
	}

	public void setDtype(Values dtype) {
		this.dtype = dtype;
	}
	
	
}
