package com.grvtech.cdis.model;

import java.util.Comparator;

public class Value {
	private int idvalue;
	private String name;
	private String value;
	private String vtype;
	private String date;
	private String unit;
	private String code;
	private int order;
	
	
	public Value(int idvalue, String name, String value, String type,
			String date, String unit, String code, int order) {
		super();
		this.idvalue = idvalue;
		this.name = name;
		this.value = value;
		this.vtype = type;
		this.date = date;
		this.unit = unit;
		this.code = code;
		this.order = order;
		
	}
	
	public Value() {
		// TODO Auto-generated constructor stub
	}

	
	public int getOrder() {
		return order;
	}
	public void setOrder(int order) {
		this.order = order;
	}

	public int getIdvalue() {
		return idvalue;
	}
	public void setIdvalue(int idvalue) {
		this.idvalue = idvalue;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public String getVtype() {
		return vtype;
	}
	public void setVtype(String type) {
		this.vtype = type;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}
	
	public static Comparator<Value> ValueComparatorASC = new Comparator<Value>() {
		public int compare(Value v1, Value v2) {
		   int order1 = v1.getOrder();
		   int order2 = v2.getOrder();
		   return order1-order2;
	    }};
	
	public static Comparator<Value> ValueComparatorDESC = new Comparator<Value>() {
		public int compare(Value v1, Value v2) {
		   int order1 = v1.getOrder();
		   int order2 = v2.getOrder();
		   //ascending order
		   return order2-order1;
	    }};
	
	
	
}
