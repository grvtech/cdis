/**
 * 
 */
package com.grvtech.cdis.model;


import java.util.HashMap;

/**
 * @author radu
 *
 */
public class Depression {
	
	private Values deps;
	private Values score;
	
	public Depression(Values deps, Values score) {
		super();
		this.deps = deps;
		this.score = score;
	
	}
	
	public Depression(HashMap<String, Values> map) {
		super();
		this.deps = map.get("deps");
		this.score = map.get("score");
		
	}
	
	public HashMap<String, Value> getLatestDepression(){
		HashMap<String, Value> result = new HashMap<String, Value>();
		result.put("deps",this.deps.getLastValue());
		result.put("score",this.score.getLastValue());
		return result;
	}

	
	
	public Values getDeps() {
		return deps;
	}
	public void setDeps(Values deps) {
		this.deps = deps;
	}
	public Values getScore() {
		return score;
	}
	public void setScore(Values score) {
		this.score = score;
	}

}
