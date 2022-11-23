SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[GetPODetailList]
(
@CID int,
@BudgetID int,
@BudgetFileID int,
@BudgetCategoryID int,
@AccountNumber varchar(50),
@ProdID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @ClosePeriodCheck int;
	declare @OpenPeriodCheck int;
	declare @Start date;
	declare @End date;


	select @ClosePeriodCheck=count(*) from ClosePeriod where CompanyId=@CID;
    
	if(@ClosePeriodCheck>0)
	begin
     	select @OpenPeriodCheck=count(*) from ClosePeriod where CompanyId=@CID and Status!='Close';
		if(@OpenPeriodCheck>0)
		begin
           select top(1) @Start=StartPeriod,@End=EndPeriod from ClosePeriod where CompanyId=@CID and Status!='Close' order by StartPeriod desc 
		end
		else
		begin

               declare @Defaultvalue varchar(50);

		       select @Defaultvalue= DefaultValue from Company where companyid=@CID;

			   select top(1) @Start=StartPeriod,@End=EndPeriod from ClosePeriod where CompanyId=@CID and Status='Close' order by StartPeriod desc ;

			   if(@Defaultvalue='Weekly')
			   begin
			   set @Start=DATEADD(day,7,@End)
			   set @End=DATEADD(day,7,@Start)
			   end
			   else
			   begin
			    set @Start=DATEADD(day,1,@End)
			    set @End= DATEADD(day,1,@Start)
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
			           set @Start=@Period;
			           set @End= DATEADD(day,7,@Start)  
					end
					else
					begin
					   set @Start=DATEADD(day,7,@Period) 
			           set @End=DATEADD(day,7,@Start)
					end
			   
			   end
			   else
			   begin

			   if(@PeriodStartType='Period Start')
					 begin
			           set @Start=@Period;
			           set @End=DATEADD(day,1,@Start) 
					end
					else
					begin
					   set @Start=DATEADD(day,1,@Period) 
			           set @End=DATEADD(day,1,@Start)
					end	   
			   end
	end 

select distinct a.POID,a.COAID,a.Amount,a.LineDescription,b.VendorName ,convert(varchar(10),a.CreatedDate,101) as PODate,
b.PONumber,CASE WHEN a.CreatedDate between @Start and @End THEN  sum(a.Amount)
 ELSE '0' END as  ddd 
 from PurchaseOrderLine as a 
inner join PurchaseOrder as b on a.POID=b.POID
inner join CRWDetail as c on a.COAID=c.COAID
 where a.ProdID=@ProdID and a.POLinestatus!='Paid' and a.COAString like '%'+@AccountNumber+'%'
 group by  a.POID,a.COAID,a.Amount,a.LineDescription,b.VendorName ,a.CreatedDate,
b.PONumber, a.CreatedDate 



END



GO