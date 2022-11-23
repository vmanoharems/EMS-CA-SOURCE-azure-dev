SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO



CREATE PROCEDURE [dbo].[GetPODetailListCRW]   -- GetPODetailListCRW 1,2,61,2942,3,'600-01'
(
@CID int,
@BudgetID int,
@BudgetFileID int,
@BudgetCategoryID int,
@ProdID int,
@AccountNumber varchar(50)
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

	
select distinct a.CategoryNumber,a.AccountNumber,a.PO,CONVERT(varchar(10),a.Date,101) as Date,c.VendorName
,b.LineDescription,b.COAID ,CASE WHEN a.Date between @Start and @End THEN  sum(a.PO)
 ELSE '0' END as  ddd 
 from CRWDetail as a 
inner join PurchaseOrderLine as b on a.coaID=b.COAID and b.ProdID=@ProdID and a.PO=b.Amount
inner join PurchaseOrder as c on b.POID=c.POID and c.ProdID=@ProdID
 where a.AccountNumber=@AccountNumber and a.BudgetID=@BudgetID and a.BudgetFileid=@BudgetFileID and a.PO!=0
 group by a.CategoryNumber,a.AccountNumber,a.PO, a.Date,c.VendorName
,b.LineDescription,b.COAID
END



GO