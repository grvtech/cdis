package com.grvtech.cdis.model;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.GregorianCalendar;

public class Values {
	private ArrayList<Value> values;
	
	public Values(ArrayList<Value> v) {
		super();
		this.values = v;
	}

	public Values() {
		this.values = new ArrayList<Value>();
	}

	public ArrayList<Value> getValues() {
		return values;
	}

	public void setValues(ArrayList<Value> values) {
		this.values = values;
	}
	
	
	public Value getLastValue(){
		Value result = null;
		Calendar calendar = new GregorianCalendar(1900,0,1);
		Date old =  calendar.getTime();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		for(int i=0;i<this.values.size();i++){
			Value r = values.get(i);
			String d = r.getDate();
			if(!d.equals("NULL")){
				try {
					Date vdate = sdf.parse(d);
					if(old.before(vdate)){
						result = r;
						old = vdate;
					}
				} catch (ParseException e) {
					e.printStackTrace();
				}
			}
		}
		return result;
	}
	
	public void orderValues(String sort){
		/*
		 * sort = asc|desc
		 * */
		if(sort.equals("asc")){
			Collections.sort(values, Value.ValueComparatorASC);
		}else if(sort.equals("desc")){
			Collections.sort(values, Value.ValueComparatorDESC);
		}
	}
	
	public void addValue(Value v){
		this.values.add(v);
	}
	
	public Value getValue(String label, String value){
		/*
		 * label can be idvalue or date
		 *  
		 * */
		Value result = new Value();
		for(int i=0;i<this.values.size();i++){
			Value r = values.get(i);
			if(label.equalsIgnoreCase("idvalue")){
				int id = r.getIdvalue();
				if(id == Integer.parseInt(value)){
					result = r;
					break;
				}
			}else if(label.equals("date")){
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				SimpleDateFormat sdfDay = new SimpleDateFormat("yyyy-MM-dd");
				String d = r.getDate();
				/*get values from same day*/
				Date vdate;
				try {
					vdate = sdf.parse(d);
					String vdateStr = sdfDay.format(vdate);
					if(vdateStr.equals(value)){
						result = r;
						break;
					}
				} catch (ParseException e) {
					e.printStackTrace();
				}
			}
		}/*end for*/
		return result;
	}
	
	
}
