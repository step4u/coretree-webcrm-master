package com.coretree.defaultconfig.controller;

import java.security.Principal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.coretree.defaultconfig.mapper.StatisticsMapper;
import com.coretree.defaultconfig.model.CalltimePivot;
import com.coretree.defaultconfig.model.StatisticsSearchConditions;
import com.coretree.defaultconfig.model.WorkTime;
import com.coretree.defaultconfig.model.WorkTimes;
import com.coretree.defaultconfig.mapper.Cdr;

@RestController
public class StatisticsController {
	
	@Autowired
	StatisticsMapper mapper;
	
	@RequestMapping(path="/statistics01/get/all", method=RequestMethod.POST)
	public List<CalltimePivot> getAll(@RequestBody StatisticsSearchConditions condition, Principal principal) {
		List<Cdr> cdrs = mapper.getAll(condition);
		List<CalltimePivot> callpivots = new  ArrayList<CalltimePivot>();
		
		WorkTimes worktimes = new WorkTimes();
		for (WorkTime wt : worktimes.Get()) {
			CalltimePivot cp = new CalltimePivot();
			cp.setTimerange(wt.getTxt());
			//cp.setTotalnum(cdrs.stream().filter( x -> x.getSdate().get(Calendar.HOUR_OF_DAY) == wt.getWtime() ).mapToLong(x -> x.getTotalsecs()).sum());
			cp.setTotalnum(cdrs.stream().filter( x -> x.getTotalsecs() > 0 && x.getSdate().get(Calendar.HOUR_OF_DAY) == wt.getWtime() ).count());
			cp.setCol30(cdrs.stream().filter( x -> (x.getTotalsecs() > 0 && x.getTotalsecs() <= 30 && x.getSdate().get(Calendar.HOUR_OF_DAY) == wt.getWtime()) ).count());
			cp.setCol60(cdrs.stream().filter( x -> (x.getTotalsecs() > 30 && x.getTotalsecs() <= 60 && x.getSdate().get(Calendar.HOUR_OF_DAY) == wt.getWtime()) ).count());
			cp.setCol180(cdrs.stream().filter( x -> (x.getTotalsecs() > 60 && x.getTotalsecs() <= 180 && x.getSdate().get(Calendar.HOUR_OF_DAY) == wt.getWtime()) ).count());
			cp.setCol300(cdrs.stream().filter( x -> (x.getTotalsecs() > 180 && x.getTotalsecs() <= 300 && x.getSdate().get(Calendar.HOUR_OF_DAY) == wt.getWtime()) ).count());
			cp.setCol600(cdrs.stream().filter( x -> (x.getTotalsecs() > 300 && x.getTotalsecs() <= 600 && x.getSdate().get(Calendar.HOUR_OF_DAY) == wt.getWtime()) ).count());
			cp.setCol1800(cdrs.stream().filter( x -> (x.getTotalsecs() > 600 && x.getTotalsecs() <= 1800 && x.getSdate().get(Calendar.HOUR_OF_DAY) == wt.getWtime()) ).count());
			cp.setCol3600(cdrs.stream().filter( x -> (x.getTotalsecs() > 1800 && x.getTotalsecs() <= 3600 && x.getSdate().get(Calendar.HOUR_OF_DAY) == wt.getWtime()) ).count());
			cp.setColall(cdrs.stream().filter( x -> (x.getTotalsecs() > 3600 && x.getSdate().get(Calendar.HOUR_OF_DAY) == wt.getWtime()) ).count());
			long avg = 0;
			if (cdrs.size() > 0) {
				avg = cdrs.stream().filter( x -> x.getSdate().get(Calendar.HOUR_OF_DAY) == wt.getWtime() ).mapToLong(x -> x.getTotalsecs()).sum() / cdrs.size();
			}
			cp.setColavg(avg);
			
			callpivots.add(cp);
		}
		
		return callpivots;
	}
	
	@RequestMapping(path="/statistics01/get/bydays", method=RequestMethod.POST)
	public List<CalltimePivot> getByDays(@RequestBody StatisticsSearchConditions condition, Principal principal) {
		List<Cdr> cdrs = mapper.getAll(condition);
		List<CalltimePivot> callpivots = new  ArrayList<CalltimePivot>();
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd"); 
		Date sdate = null;
		Calendar scalendar = Calendar.getInstance();
		try {
			if (condition.getSdate().isEmpty()) {
				scalendar.set(Calendar.DAY_OF_MONTH, 1);
				sdate = scalendar.getTime();
			} else {
				sdate = sdf.parse(condition.getSdate());
				scalendar.setTime(sdate);
			}
		} catch (ParseException e1) {
			e1.printStackTrace();
		}
		
		Date edate = null;
		Calendar ecalendar = Calendar.getInstance();
		try {
			if (condition.getEdate().isEmpty()) {
				edate = ecalendar.getTime();
			} else {
				edate = sdf.parse(condition.getEdate());
				ecalendar.setTime(edate);
			}
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
		long timeDifference = 0;
		if (sdate != null && edate != null) {
			timeDifference = edate.getTime() - sdate.getTime();
		}
		 
		long daysInBetween = timeDifference / (24*60*60*1000);
		
		for (int i = 0 ; i <= daysInBetween ; i++) {
			CalltimePivot cp = new CalltimePivot();
			Calendar sc = (Calendar) scalendar.clone();
			
			sc.add(Calendar.DAY_OF_MONTH, i); 
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			dateFormat.setTimeZone(sc.getTimeZone());
			cp.setTimerange(dateFormat.format(sc.getTime()));

			//cp.setTotalnum(cdrs.stream().filter( x -> dateFormat.format(x.getSdate().getTime()).equals(cp.getTimerange()) ).mapToLong(x -> x.getTotalsecs()).sum());
			cp.setTotalnum(cdrs.stream().filter( x -> x.getTotalsecs() > 0 && dateFormat.format(x.getSdate().getTime()).equals(cp.getTimerange()) ).count());
			cp.setCol30(cdrs.stream().filter( x -> (x.getTotalsecs() > 0 && x.getTotalsecs() <= 30 && dateFormat.format(x.getSdate().getTime()).equals(cp.getTimerange())) ).count());
			cp.setCol60(cdrs.stream().filter( x -> (x.getTotalsecs() > 30 && x.getTotalsecs() <= 60 && dateFormat.format(x.getSdate().getTime()).equals(cp.getTimerange())) ).count());
			cp.setCol180(cdrs.stream().filter( x -> (x.getTotalsecs() > 60 && x.getTotalsecs() <= 180 && dateFormat.format(x.getSdate().getTime()).equals(cp.getTimerange())) ).count());
			cp.setCol300(cdrs.stream().filter( x -> (x.getTotalsecs() > 180 && x.getTotalsecs() <= 300 && dateFormat.format(x.getSdate().getTime()).equals(cp.getTimerange())) ).count());
			cp.setCol600(cdrs.stream().filter( x -> (x.getTotalsecs() > 300 && x.getTotalsecs() <= 600 && dateFormat.format(x.getSdate().getTime()).equals(cp.getTimerange())) ).count());
			cp.setCol1800(cdrs.stream().filter( x -> (x.getTotalsecs() > 600 && x.getTotalsecs() <= 1800 && dateFormat.format(x.getSdate().getTime()).equals(cp.getTimerange())) ).count());
			cp.setCol3600(cdrs.stream().filter( x -> (x.getTotalsecs() > 1800 && x.getTotalsecs() <= 3600 && dateFormat.format(x.getSdate().getTime()).equals(cp.getTimerange())) ).count());
			cp.setColall(cdrs.stream().filter( x -> (x.getTotalsecs() > 3600 && dateFormat.format(x.getSdate().getTime()).equals(cp.getTimerange())) ).count());
			long avg = 0;
			if (cdrs.size() > 0) {
				avg = cdrs.stream().filter( x -> dateFormat.format(x.getSdate().getTime()).equals(cp.getTimerange()) ).mapToLong(x -> x.getTotalsecs()).sum() / cdrs.size();
			}
			cp.setColavg(avg);
			
			callpivots.add(cp);
		}
		
		return callpivots;
	}
	
	@RequestMapping(path="/statistics01/get/bymonth", method=RequestMethod.POST)
	public List<CalltimePivot> getByMonth(@RequestBody StatisticsSearchConditions condition, Principal principal) {
		List<Cdr> cdrs = mapper.getAll(condition);
		List<CalltimePivot> callpivots = new  ArrayList<CalltimePivot>();
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM"); 
		Date sdate = null;
		Calendar scalendar = Calendar.getInstance();
		try {
			if (condition.getSdate().isEmpty()) {
				scalendar.set(Calendar.DAY_OF_MONTH, 1);
				sdate = scalendar.getTime();
			} else {
				sdate = sdf.parse(condition.getSdate());
				scalendar.setTime(sdate);
			}
		} catch (ParseException e1) {
			e1.printStackTrace();
		}
		
		Date edate = null;
		Calendar ecalendar = Calendar.getInstance();
		try {
			if (condition.getEdate().isEmpty()) {
				ecalendar.set(Calendar.DAY_OF_MONTH, 1);
				edate = ecalendar.getTime();
			} else {
				edate = sdf.parse(condition.getEdate());
				ecalendar.setTime(edate);
			}
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
/*		long timeDifference = 0;
		if (sdate != null && edate != null) {
			timeDifference = edate.getTime() - sdate.getTime();
		}
		 
		long daysInBetween = timeDifference / (24*60*60*1000);*/
		
		int months = (ecalendar.get(Calendar.YEAR)-scalendar.get(Calendar.YEAR))*12 + ecalendar.get(Calendar.MONTH) - scalendar.get(Calendar.MONTH);
		 
		for (int i = 0 ; i <= months ; i++) {
			CalltimePivot cp = new CalltimePivot();
			Calendar sc = (Calendar) scalendar.clone();
			
			sc.add(Calendar.MONTH, i); 
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM");
			dateFormat.setTimeZone(sc.getTimeZone());
			cp.setTimerange(dateFormat.format(sc.getTime()));
			
			// cp.setTotalnum(cdrs.stream().filter( x -> dateFormat.format(x.getSdate().getTime()).equals(cp.getTimerange()) ).mapToLong(x -> x.getTotalsecs()).sum());
			cp.setTotalnum(cdrs.stream().filter( x -> x.getTotalsecs() > 0 && dateFormat.format(x.getSdate().getTime()).equals(cp.getTimerange()) ).count());
			cp.setCol30(cdrs.stream().filter( x -> (x.getTotalsecs() > 0 && x.getTotalsecs() <= 30 && dateFormat.format(x.getSdate().getTime()).equals(cp.getTimerange())) ).count());
			cp.setCol60(cdrs.stream().filter( x -> (x.getTotalsecs() > 30 && x.getTotalsecs() <= 60 && dateFormat.format(x.getSdate().getTime()).equals(cp.getTimerange())) ).count());
			cp.setCol180(cdrs.stream().filter( x -> (x.getTotalsecs() > 60 && x.getTotalsecs() <= 180 && dateFormat.format(x.getSdate().getTime()).equals(cp.getTimerange())) ).count());
			cp.setCol300(cdrs.stream().filter( x -> (x.getTotalsecs() > 180 && x.getTotalsecs() <= 300 && dateFormat.format(x.getSdate().getTime()).equals(cp.getTimerange())) ).count());
			cp.setCol600(cdrs.stream().filter( x -> (x.getTotalsecs() > 300 && x.getTotalsecs() <= 600 && dateFormat.format(x.getSdate().getTime()).equals(cp.getTimerange())) ).count());
			cp.setCol1800(cdrs.stream().filter( x -> (x.getTotalsecs() > 600 && x.getTotalsecs() <= 1800 && dateFormat.format(x.getSdate().getTime()).equals(cp.getTimerange())) ).count());
			cp.setCol3600(cdrs.stream().filter( x -> (x.getTotalsecs() > 1800 && x.getTotalsecs() <= 3600 && dateFormat.format(x.getSdate().getTime()).equals(cp.getTimerange())) ).count());
			cp.setColall(cdrs.stream().filter( x -> (x.getTotalsecs() > 3600 && dateFormat.format(x.getSdate().getTime()).equals(cp.getTimerange())) ).count());
			long avg = 0;
			if (cdrs.size() > 0) {
				avg = cdrs.stream().filter( x -> dateFormat.format(x.getSdate().getTime()).equals(cp.getTimerange()) ).mapToLong(x -> x.getTotalsecs()).sum() / cdrs.size();
			}
			cp.setColavg(avg);
			
			callpivots.add(cp);
		}
		
		return callpivots;
	}
}
