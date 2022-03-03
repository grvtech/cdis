package com.grvtech.cdis.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.StringTokenizer;

import javax.naming.InitialContext;
import javax.naming.NamingException;

import com.grvtech.cdis.db.CdisDBridge;
import com.grvtech.cdis.model.Diabet;
import com.grvtech.cdis.model.Patient;
import com.grvtech.cdis.model.Value;
import com.grvtech.cdis.model.Values;

public class ImportNames {
	
	/*
	 * "CDIS";"JBNQA";"MPI";"RAMQ";"Name";"First name";"Father's name";"AKA";"Sex";"DOB";"Community";"Deceased";"DOD";"Native";"Band number"
	 * */
	
	
	public static void importNames(){
		CdisDBridge db = new CdisDBridge();
		InitialContext ic;
		try {
			ic = new InitialContext();
			String rf = (String) ic.lookup("root-folder");
			File care4File = new File(rf+System.getProperty("file.separator")+"config"+System.getProperty("file.separator")+"patients_update.csv");
			if(care4File.exists()){
				BufferedReader br = new BufferedReader(new FileReader(care4File)); 
				String line;
				while ((line = br.readLine()) != null) {
					System.out.println(line);
					line = line.replaceAll("\"","");
					String[] parts = line.split(";");
					
					if(parts[0].equals("CDIS")){
						System.out.println("Header Line");
					}else{
						if(parts.length >= 3){
							//System.out.println("First name : "+parts[0]+"  Last Name : "+parts[1]+ " RAMQ : "+parts[2].replaceAll(" ",""));
							String ramq = parts[3].replaceAll(" ","");
							String patientID = parts[0].replaceAll(" ","");
							String jbqna = parts[1].replaceAll(" ","");
							String ipm = parts[2].replaceAll(" ","");
							String lastname = parts[4].trim();
							String firstname = parts[5].trim();
							String fathername = parts[6].replaceAll(" ","");
							String aka = parts[7].trim();
							String sexID = parts[8].replaceAll(" ","");
							String dob = parts[9].replaceAll(" ","");
							String communityID = parts[10].replaceAll(" ","");
							String dead = parts[11].replaceAll(" ","");
							String deaddate = parts[12].replaceAll(" ","");
							String nativeFlag = parts[13].replaceAll(" ",""); 
							String band = "";
							if(parts.length == 15){
								band = parts[14].replaceAll(" ","");
							}
							
							
							Patient p = db.getPatientById(Integer.parseInt(patientID));
							
							if(p != null ){
								if(p.getIdpatient() != 0 ){
									String porecla = aka.replaceAll("\\'", "\\'\\'");
									if(!aka.equals("")){porecla = "("+aka+")";}
									p.setFname(firstname.replaceAll("\\'", "\\'\\'") + " "+porecla);
									p.setLname(lastname.replaceAll("\\'", "\\'\\'"));
									p.setRamq(ramq);
									p.setBand(band);
									p.setJbnqa(jbqna);
									p.setGiu(ipm);
									p.setPlname(fathername.replaceAll("\\'", "\\'\\'"));
									p.setIdcommunity(communityID);
									if(sexID.equals("M")){
										p.setSex("1");
									}else if(sexID.equals("F")){
										p.setSex("2");
									}
									p.setDob(dob);
									if(dead.equals("1")){
										p.setDod(deaddate);
									}
									if(!nativeFlag.equals("")){
										p.setIscree(Integer.parseInt(nativeFlag));
									}
									db.editPatient(p);
								}
							}
						}
					}
				}
			}
			
		} catch (NamingException e) {
			e.printStackTrace();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e){
			e.printStackTrace();
		}
		
	}

	
	
	public static void importDiabet(){
		CdisDBridge db = new CdisDBridge();
		InitialContext ic;
		try {
			ic = new InitialContext();
			String rf = (String) ic.lookup("root-folder");
			File care4File = new File(rf+System.getProperty("file.separator")+"config"+System.getProperty("file.separator")+"update_diabet.csv");
			if(care4File.exists()){
				BufferedReader br = new BufferedReader(new FileReader(care4File)); 
				String line;
				while ((line = br.readLine()) != null) {
					System.out.println(line);
					line = line.replaceAll("\"","");
					String[] parts = line.split(";");
					
					if(parts[0].equals("CDIS")){
						System.out.println("Header Line");
					}else{
						if(parts.length >= 3){
							//System.out.println("First name : "+parts[0]+"  Last Name : "+parts[1]+ " RAMQ : "+parts[2].replaceAll(" ",""));
							
							String patientID = parts[0].replaceAll(" ","");
							String ipm = parts[1].replaceAll(" ","");
							String ddate = parts[3].replaceAll(" ","");
							SimpleDateFormat sdf1 = new SimpleDateFormat("MM/dd/yyyy");
							Date ddateObj = sdf1.parse(ddate); 
							String diabetID = parts[2].replaceAll(" ","");
							String idd ="10";
							if(diabetID.equals("4")){
								idd = "11";
							}
							if(!diabetID.equals("1") && !diabetID.equals("2")){
								
								Diabet dd = (Diabet)db.getValues("Diabet", Integer.parseInt(patientID), "");
								Values vd = dd.getDtype();
								boolean hasDate = false;
								for(int i=0; i< vd.getValues().size();i++){
									Value v = vd.getValues().get(i);
									if(v!= null){
										String d = v.getDate();
										String vv = v.getValue();
										System.out.println("db date value : "+v.getDate() +"    file date value "+ddate);
										SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd");
										if(d != "NULL"){
											Date dObj = sdf2.parse(d); 
											if(dObj.compareTo(ddateObj) == 0){
												hasDate = true;
												db.editValue("dtype", idd, d, patientID	, Integer.toString(v.getIdvalue()));
											}else{
												System.out.println("date ne egale  valoarea bd :  "+vv +"    db date value "+d);
												/*
												if(vv.equals("3") || vv.equals("5") || vv.equals("6") || vv.equals("9")){
													db.editValue("dtype", "10", d, patientID	, Integer.toString(v.getIdvalue()));
												}else if(vv.equals("4") || vv.equals("7") || vv.equals("8")){
													db.editValue("dtype", "11", d, patientID	, Integer.toString(v.getIdvalue()));
												}
												*/
											}
										}
									}
								}	
							}
							
							
						}
					}
				}
			}
			
		} catch (NamingException e) {
			e.printStackTrace();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e){
			e.printStackTrace();
		}
		
	}

	
	
	
}


