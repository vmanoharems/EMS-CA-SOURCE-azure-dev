SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO



CREATE PROCEDURE [dbo].[GetSeriesForCRW]  
	@COAID int ,
	@Setid int,
	--@CompanyId int,
	@BudgetFileID int,
	@BudgetID int,
	@Prodid int
AS
BEGIN


declare @SegmentId int;
declare @SegmentId2 int;
declare @StartDate  Datetime;
declare @Enddate Datetime;



declare @ClosePeriodCheck int;
	declare @OpenPeriodCheck int;
	declare @CID int;

	select @CID=CompanyID from BudgetFile where BudgetFileID=@BudgetFileID and prodid=@Prodid;


	select @ClosePeriodCheck=count(*) from ClosePeriod where CompanyId=@CID;
    
	if(@ClosePeriodCheck>0)
	begin
     	select @OpenPeriodCheck=count(*) from ClosePeriod where CompanyId=@CID and Status!='Close';
		if(@OpenPeriodCheck>0)
		begin
           select top(1) @StartDate=StartPeriod,@enddate=EndPeriod from ClosePeriod where 
		   CompanyId=@CID and Status!='Close' order by StartPeriod desc 
		end
		else
		begin

               declare @Defaultvalue varchar(50);

		       select @Defaultvalue= DefaultValue from Company where companyid=@CID;

			   select top(1) @StartDate=StartPeriod,@enddate=EndPeriod from ClosePeriod where CompanyId=@CID and Status='Close' order by StartPeriod desc ;

			   if(@Defaultvalue='Weekly')
			   begin
			   set @StartDate=DATEADD(day,7,@enddate)
			   set @enddate=DATEADD(day,7,@StartDate)
			   end
			   else
			   begin
			    set @StartDate=DATEADD(day,1,@enddate)
			    set @enddate= DATEADD(day,1,@StartDate)
			   end

		end
		

	end
	else
	begin
	
	 
	 declare @Period date;
	 declare @PeriodStartType varchar(50);
		       select @Defaultvalue= DefaultValue ,@Period=PeriodStart ,@PeriodStartType=PeriodStartType from Company where companyid=@CID;

			   if(@Defaultvalue='Weekly')
			   begin
			         if(@PeriodStartType='Period Start')
					 begin
			           set @StartDate=@Period;
			           set @enddate= DATEADD(day,7,@StartDate)  
					end
					else
					begin
					   set @StartDate=DATEADD(day,7,@Period) 
			           set @enddate=DATEADD(day,7,@StartDate)
					end
			   
			   end
			   else
			   begin

			   if(@PeriodStartType='Period Start')
					 begin
			           set @StartDate=@Period;
			           set @enddate=DATEADD(day,1,@StartDate) 
					end
					else
					begin
					   set @StartDate=DATEADD(day,1,@Period) 
			           set @enddate=DATEADD(day,1,@StartDate)
					end
			   
			   end

	end 





set @SegmentId=(select Segmentid from Segment where Classification='Series' and ProdId=@Prodid)

set @SegmentId2=(select Segmentid from Segment where Classification='Set' and ProdId=@Prodid)

	select COAID,b.AccountName as SeriesDescription ,b.AccountCode as SeriesCode ,
b.Accountid as SeriesID,a.Accountid as Setid,dbo.GetPoAmountforSetSeries(@COAID,@Setid,b.Accountid) as PoAmount,
dbo.GetActualtoDateforSetSeries(@COAID,@Setid,b.Accountid) as ActualtoDate,
dbo.GetActualthisPeriodforSetSeries(@COAID,@StartDate,@Enddate,@Setid,b.Accountid) as ActualthisPeriod
 from COA Cross Join  tblaccounts a Cross Join tblaccounts b where 
  COAID=@COAID and a.SegmentID=@SegmentId2 and b.SegmentID=@SegmentId and 
  A.Accountid=@Setid Order By SeriesCode
END




GO