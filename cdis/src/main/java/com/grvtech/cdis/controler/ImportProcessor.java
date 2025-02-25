package  com.grvtech.cdis.controler;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.grvtech.cdis.db.CdisDBridge;
import com.grvtech.cdis.db.ChbDBridge;
import com.grvtech.cdis.model.Lab;
import com.grvtech.cdis.model.Lipid;
import com.grvtech.cdis.model.Patient;
import com.grvtech.cdis.model.Renal;
import com.grvtech.cdis.model.Value;
import com.grvtech.cdis.model.Values;
import com.grvtech.cdis.util.FileTool;
import com.grvtech.cdis.util.FtpTool;
import com.grvtech.cdis.util.MailTool;


@RestController
public class ImportProcessor {
	
	
	@Autowired
	ChbDBridge chbdb;
	
	@Autowired
	CdisDBridge cdisdb;
	
	@Autowired
	FileTool ft;
	
	@Autowired
	FtpTool ftp;
	
	
	@Autowired
	MailTool mt;
	
	@org.springframework.beans.factory.annotation.Value("${homefolder}")
	private String homefolder;
	
	@org.springframework.beans.factory.annotation.Value("${reports}")
	private String reportsFolder;
	
	/*
	 * /ncdis/service/import/exportRamq?iduser=XX
	 * */
	@RequestMapping(value = {"/service/import/exportRamq"}, method = RequestMethod.GET)
	public String exportRamq(final HttpServletRequest request){
		Gson json = new Gson();
		String result = "";
		String exportRamqFile = cdisdb.exportRamq();
		
		
		if(!ftp.putFile(exportRamqFile, "chibougamou")){
			result += "chisbougamou - not exported";
		}else {
			result += " chisbougamou exported ";
		}
		
		if(!ftp.putFile(exportRamqFile, "chisasibi")){
			result = "chisasibi - not exported";
		}else {
			result = " chisasibi exported ";
		}
		result = json.toJson(result);
		
		return result;
	}
	
	
	@RequestMapping(value = {"/service/import/importOmnilab"}, method = RequestMethod.GET)
	public String importOmnilab(final HttpServletRequest request){
		Gson json = new Gson();
		String result = "";
		//InitialContext ic;
		SimpleDateFormat df = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
		Date now = new Date();
		ArrayList<Hashtable<String,Object>> chisasibiStr = importData("chisasibi");
		ArrayList<Hashtable<String,Object>> chibougamouStr = importData("chibougamou");
		//MailTool.sendMailText("CDIS Import Interface", chisasibiStr+"\n\n"+chibougamouStr, "radu@grvtech.ca");
		//MailTool.sendMailInHtml("CDIS Import Interface", "Chisasibi<br><br>Chibougamou", "support@grvtech.ca");

		Hashtable<String, Object> rez = new Hashtable<>();
		rez.put("chisasibi", chisasibiStr);
		rez.put("chibougamou", chibougamouStr);
		result = json.toJson(rez);	
		
		String rf = "";
		File reportFile = null;
		Date today = new Date();
        SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("dd-MM-yyyy");
        String dateStr = DATE_FORMAT.format(today);
		try {
			//ic = new InitialContext();
			//rf = (String) ic.lookup("reports-folder");
			reportFile = new File(reportsFolder+System.getProperty("file.separator")+"import"+System.getProperty("file.separator")+"import_"+dateStr+".json");
			if(!reportFile.exists())reportFile.createNewFile();
			FileWriter fw =  new FileWriter(reportFile,true);
			fw.write(result);
			fw.close();
		}  catch (IOException e) {
			e.printStackTrace();
		}
		
		return result;
	}
	
	
	private  ArrayList<Hashtable<String, String>> updateData(Object obj, String[] vars, Hashtable<String, String> dataLine, Patient pat){
		ArrayList<Hashtable<String, String>> result = new ArrayList<>();
		//CdisDBridge db = new CdisDBridge();
		SimpleDateFormat fileFormat = new SimpleDateFormat("MM/dd/yyyy");
	    SimpleDateFormat dbFormat = new SimpleDateFormat("yyyy-MM-dd");
	    String date = dataLine.get("collecteddate");
	    String ramq = dataLine.get("ramq");
	    Date fileDate = null;
		try {
			fileDate = fileFormat.parse(date);
		} catch (ParseException e1) {
			e1.printStackTrace();
		}
		String var = "";
		for(int x=0;x<vars.length;x++){
			if(vars[x].equals("Pcr")){
				var = "pccmgmmol";
			}else if(vars[x].equals("Pcrg")){
				var = "pcconvgg";
			}else{
				var = vars[x];
			}
			
			String value = dataLine.get(var.toLowerCase());
			 
			
			if(value == null || value.equals("")){

			}else{
				double fileDoubleValue = 0;
				try{
					if(value.indexOf(">") >= 0){
						value = value.replaceAll(">", "");
						fileDoubleValue = Double.parseDouble(value) + 1;
					}else if(value.indexOf("<") >= 0){
						value = value.replaceAll("<", "");
						fileDoubleValue = Double.parseDouble(value) - 1;
					}else if(value.indexOf("non") >= 0){
						
					}else if(value.indexOf("*") >= 0){
						
					}else if(value.indexOf("re") >= 0){
						
					}else if(value.equals(".")){
						
					}else if(value.equals("-")){
						
					}else if(value.equals("\\.")){
						
					}else if(value.equals("cancel")){
						
					}else if(value.indexOf("ann") >= 0){
						
					}else{
						fileDoubleValue = Double.parseDouble(value);
					}
				}catch(NumberFormatException ex){
					ex.printStackTrace();
				}
				Class<?> cls =  obj.getClass();
				Values vals = new Values();
				try {
					Method m = Class.forName(cls.getName()).getDeclaredMethod("get"+vars[x]);
					vals = (Values) m.invoke(obj);
				} catch (SecurityException e) {
					e.printStackTrace();
				} catch (NoSuchMethodException e) {
					e.printStackTrace();
				} catch (IllegalAccessException e) {
					e.printStackTrace();
				} catch (IllegalArgumentException e) {
					e.printStackTrace();
				} catch (InvocationTargetException e) {
					e.printStackTrace();
				} catch (ClassNotFoundException e) {
					e.printStackTrace();
				}
				boolean inBD = false;

				if(vals != null ){
					ArrayList<Value> listVals = vals.getValues();
					
					ArrayList<String> valuesDates = new ArrayList<>();
					for(int s =0; s<listVals.size();s++){
						Value v = listVals.get(s);
						valuesDates.add(v.getDate());
					}
					if(valuesDates.contains(dbFormat.format(fileDate))){
						//date is already in db should I update ????
						
					}else{
						//date is not in db
						if(fileDoubleValue > 0){
							
							if(vars[x].toLowerCase().equals("hba1c")){
								if(fileDoubleValue > 1){
									fileDoubleValue = fileDoubleValue * 0.01;
								}
							}
							Hashtable<String, String> insert = new Hashtable<>();
							insert.put("namevalue", vars[x].toLowerCase());
							insert.put("datevalue",dbFormat.format(fileDate));
							insert.put("value", Double.toString(fileDoubleValue));
							result.add(insert);
							cdisdb.addValue(vars[x].toLowerCase(), Double.toString(fileDoubleValue), dbFormat.format(fileDate), Integer.toString(pat.getIdpatient()));
						}
					}
				}else {
					
					
					//date is not in db
					if(fileDoubleValue > 0){
						
						if(vars[x].toLowerCase().equals("hba1c")){
							if(fileDoubleValue > 1){
								fileDoubleValue = fileDoubleValue * 0.01;
							}
						}
						Hashtable<String, String> insert = new Hashtable<>();
						insert.put("namevalue", vars[x].toLowerCase());
						insert.put("datevalue",dbFormat.format(fileDate));
						insert.put("value", Double.toString(fileDoubleValue));
						result.add(insert);
						cdisdb.addValue(vars[x].toLowerCase(), Double.toString(fileDoubleValue), dbFormat.format(fileDate), Integer.toString(pat.getIdpatient()));
					}
				}
			}
		}
		return result;
	}

	/*
	private static String updateDataBackup(Object obj, String[] vars, Hashtable<String, String> dataLine, Patient pat){
		String result = "0";
		CdisDBridge db = new CdisDBridge();
		SimpleDateFormat fileFormat = new SimpleDateFormat("MM/dd/yyyy");
	    SimpleDateFormat dbFormat = new SimpleDateFormat("yyyy-MM-dd");
	    String date = dataLine.get("collecteddate");
	    String ramq = dataLine.get("ramq");
	    Date fileDate = null;
		try {
			fileDate = fileFormat.parse(date);
		} catch (ParseException e1) {
			e1.printStackTrace();
		}
	    String updates = "Updates:";
	    String inserts = "Inserts:";
	    int ups = 0;
	    int ins = 0;
		String var = "";
		
		for(int x=0;x<vars.length;x++){
			if(vars[x].equals("Pcr")){
				var = "pccmgmmol";
			}else if(vars[x].equals("Pcrg")){
				var = "pcconvgg";
			}else{
				var = vars[x];
			}
			
			String value = dataLine.get(var.toLowerCase());
			 
			
			if(value == null || value.equals("")){

			}else{
				double fileDoubleValue = 0;
				try{
					if(value.indexOf(">") >= 0){
						value = value.replaceAll(">", "");
						fileDoubleValue = Double.parseDouble(value) + 1;
					}else if(value.indexOf("<") >= 0){
						value = value.replaceAll("<", "");
						fileDoubleValue = Double.parseDouble(value) - 1;
					}else if(value.indexOf("non") >= 0){
						
					}else if(value.indexOf("*") >= 0){
						
					}else if(value.indexOf("re") >= 0){
						
					}else if(value.equals("\\.")){
						
					}else if(value.equals("cancel")){
						
					}else if(value.indexOf("ann") >= 0){
						
					}else{
						fileDoubleValue = Double.parseDouble(value);
					}
				}catch(NumberFormatException ex){
					ex.printStackTrace();
				}
				Class<?> cls =  obj.getClass();
				Values vals = new Values();
				try {
					Method m = Class.forName(cls.getName()).getDeclaredMethod("get"+vars[x]);
					vals = (Values) m.invoke(obj);
				} catch (SecurityException e) {
					e.printStackTrace();
				} catch (NoSuchMethodException e) {
					e.printStackTrace();
				} catch (IllegalAccessException e) {
					e.printStackTrace();
				} catch (IllegalArgumentException e) {
					e.printStackTrace();
				} catch (InvocationTargetException e) {
					e.printStackTrace();
				} catch (ClassNotFoundException e) {
					e.printStackTrace();
				}
				boolean inBD = false;
								
				if(vals != null ){
					ArrayList<Value> listVals = vals.getValues();
					
					for(int xx =0; xx<listVals.size();xx++){
						Value v = listVals.get(xx); 
						String dateValue = v.getDate();
						String valuevalue = v.getValue();
						if(!dateValue.equals("NULL")){
							Date dbDate = null;
							try {
								dbDate = dbFormat.parse(dateValue);
							} catch (ParseException e) {
								e.printStackTrace();
							}
							if(valuevalue.equals("null")){
								db.deleteValue(Integer.toString(v.getIdvalue()));
							}else{
								double dbValueDouble = 0;
								try{
									dbValueDouble = Double.parseDouble(valuevalue);
								}catch(NumberFormatException ex){
									ex.printStackTrace();
									db.deleteValue(Integer.toString(v.getIdvalue()));
								}
								
								if(fileDate.equals(dbDate)){
									if(dbValueDouble != fileDoubleValue){
										if(fileDoubleValue > 0){
											ups ++;
											
											//treatement special for hba1c
											if(v.getCode().equals("hba1c")){
												// check id file value is < 1
												if(fileDoubleValue > 1){
													fileDoubleValue = fileDoubleValue * 0.01;
												}
												db.editValue(v.getCode(), Double.toString(fileDoubleValue), v.getDate(), Integer.toString(pat.getIdpatient()), Integer.toString(v.getIdvalue()));
											}else{
												db.editValue(v.getCode(), Double.toString(fileDoubleValue), v.getDate(), Integer.toString(pat.getIdpatient()), Integer.toString(v.getIdvalue()));
											}
										}
									}else{
										//treatement special for hba1c
										if(v.getCode().equals("hba1c")){
											if(dbValueDouble > 1){
												dbValueDouble = dbValueDouble * 0.01;
												db.editValue(v.getCode(), Double.toString(dbValueDouble), v.getDate(), Integer.toString(pat.getIdpatient()), Integer.toString(v.getIdvalue()));
											}
										}
									}
									inBD = true;
								}
							}
						}
					}//end for
				}
				
				if(!inBD){
					if(fileDoubleValue > 0){
						ins++;
						if(vars[x].toLowerCase().equals("hba1c")){
							if(fileDoubleValue > 1){
								fileDoubleValue = fileDoubleValue * 0.01;
							}
						}
						db.addValue(vars[x].toLowerCase(), Double.toString(fileDoubleValue), dbFormat.format(fileDate), Integer.toString(pat.getIdpatient()));
					}
				}
			}
		}
		result = ups+":"+ins;
		
		return result;
	}
	*/
	
	public ArrayList<Hashtable<String,Object>> importData(String place){
		Gson json = new Gson();
		ArrayList<Hashtable<String,Object>> result = new ArrayList<>();
		//CdisDBridge db = new CdisDBridge();
		
		//download file 
		Date today = new Date();
        SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("dd-MM-yyyy");
        SimpleDateFormat fileFormat = new SimpleDateFormat("MM/dd/yyyy");
        SimpleDateFormat dbFormat = new SimpleDateFormat("yyyy-MM-dd");
        String dateStr = DATE_FORMAT.format(today);
		InitialContext ic;
		
		String[] lipidVars = {"Tchol","Tglycer","Hdl","Ldl","Tchdl"};
		String[] labVars = {"Hba1c","Acglu","Ogtt"};
		String[] renalVars = {"Acratio","Prote","Crcl","Crea","Egfr","Pcr","Pcrg"};
		File logFile = null;
		String rf = "";
		FileWriter fw = null;
		try {
			logFile = new File(homefolder+System.getProperty("file.separator")+"logs"+System.getProperty("file.separator")+"log-"+place+"_"+dateStr+".log");
			fw = new FileWriter(logFile,true);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		try {
			File importFile = new File(homefolder+System.getProperty("file.separator")+"files"+System.getProperty("file.separator")+"import-"+place+"_"+dateStr+".csv");
			
			if(ftp.getFile(importFile.getAbsolutePath(), place)){
				
			//if(importFile.exists()){
			/*this is for local testing*/	
				fw.write("File download from "+place+" - SUCCES\n");
				FileInputStream fstream = new FileInputStream(importFile);
				BufferedReader br = new BufferedReader(new InputStreamReader(fstream));
				Patient pat = new Patient();
				Renal ren = null;
				Lab lab = null;
				Lipid lip = null;
				String strLine;
				
				//Read File Line By Line
				int index = 2;
				List<String> header = new ArrayList<String>();
				
				ArrayList<String> ramqs = new ArrayList<>();
				HashMap<String, ArrayList<Hashtable<String, String>>> data = new HashMap<>();
				int nolines = 0;
				
				while ((strLine = br.readLine()) != null)   {
					strLine = strLine.replaceAll("\\\"", "");
					strLine = strLine.replaceAll("\\\'", "");
					strLine = strLine.replaceAll("\\(", "");
					strLine = strLine.replaceAll("\\)", "");
					strLine = strLine.replaceAll(" ", "");
					strLine = strLine.toLowerCase();
					
					
					Hashtable<String, String> dataLine	= new Hashtable<>();
					List<String> lineList = new ArrayList<>();
					
					if(strLine.indexOf("ramq") >= 0){
						//first line
						header = Arrays.asList(strLine.split(","));
						
					}else{
						
						lineList = Arrays.asList(strLine.split(","));
						
						for(int i=0;i<lineList.size();i++){
							dataLine.put(header.get(i).trim(), lineList.get(i).trim());
						}
						
						String ramq = dataLine.get("ramq");
						ArrayList<Hashtable<String, String>> l = new ArrayList<>();
						if(!ramqs.contains(ramq)){
							ramqs.add(ramq);
						}else{
							l = data.get(ramq);
						}
						
						l.add(dataLine);
						data.put(ramq, l);					
						index++;
					}
					nolines ++;
				}
				//Close the input stream
				br.close();
				String lastramq = "";

				for(int j=0;j<ramqs.size();j++){
					String ramqStr = ramqs.get(j);
					fw.write("Patient:"+ramqStr+" - ");
					ArrayList<Hashtable<String, String>> dls = data.get(ramqStr);
					
					
					List<Hashtable<String,String>> labP = new ArrayList();
					List<Hashtable<String,String>> lipP = new ArrayList();
					List<Hashtable<String,String>> renP = new ArrayList();
					boolean hasLabIns=false, hasLipIns=false, hasRenIns=false;
					Hashtable<String,Object> r = new Hashtable<>();
					pat = cdisdb.getPatientByRamq(ramqStr);
					r.put("ramq", ramqStr);
					
					if(pat.isValidPatient()){
						r.put("idcommunity", pat.getIdcommunity());
						
						for(int jj=0;jj<dls.size();jj++){
							Hashtable<String, String> dl = dls.get(jj);
							
							Date d = new Date();
							Calendar c = Calendar.getInstance();
					        c.setTime(d);
					        // treat only data from last 3 years 
					        c.add(Calendar.YEAR, -3);
					        
					        Date testDate = c.getTime();
							Date lineDate = fileFormat.parse(dl.get("collecteddate"));
							
							if(lineDate.after(testDate)){
								if(!ramqStr.equals(lastramq)){
									
									ren = (Renal)cdisdb.getAllValues("Renal","REN", pat.getIdpatient(), "");
									lab = (Lab)cdisdb.getAllValues("Lab","LAB", pat.getIdpatient(), "");
									lip = (Lipid)cdisdb.getAllValues("Lipid","LIP", pat.getIdpatient(), "");
									lastramq = ramqStr;
								}
								if(pat.getIdpatient() != 0){
									
									ArrayList<Hashtable<String,String>> ulab = updateData(lab, labVars, dl, pat);
									ArrayList<Hashtable<String,String>> ulip = updateData(lip, lipidVars, dl, pat);
									ArrayList<Hashtable<String,String>> uren = updateData(ren, renalVars, dl, pat);
									
									if(ulab.size() > 0 ){
										labP.addAll(ulab);
									}
									if(ulip.size() > 0 ){
										lipP.addAll(ulip);
									}
									if(uren.size() >0){
										renP.addAll(uren);
									}
									
								}
							}
							
						}
						if(labP.size() > 0){
							hasLabIns = true;
							r.put("lab", labP);
						}
						if(lipP.size() > 0){
							hasLipIns = true;
							r.put("lipid", lipP);
						}
						if(renP.size() > 0){
							hasRenIns = true;
							r.put("renal", renP);
						}
						if(hasLabIns || hasLipIns || hasRenIns){
							result.add(r);
						}
					}
					
					
				}
			}else {
				System.out.println("++++++++++++++++++++++++++++++++++++++++");
				System.out.println("ftp get file not working");
				System.out.println("++++++++++++++++++++++++++++++++++++++++");
			}
			
		}catch(Exception ex){
			ex.printStackTrace();
		}finally{
			try {
				fw.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
			
				
		return result;
	}
	
	
	
	public int parseCount(String variable, String value){
		String[] parts = value.split(":");
		if(variable.endsWith("insert")){
			return Integer.parseInt(parts[1]);
		}else{
			return Integer.parseInt(parts[0]);
		}
	}
	
	
}
