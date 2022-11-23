SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO




CREATE PROCEDURE [dbo].[GetJEDetailListCRW]   -- GetJEDetailListCRW 1,3,'600-01'
(
@CID int,
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

	
select a.COAId,a.VendorName,a.Note,convert(varchar(10),a.CreatedDate,101) as CDate, a.CreditAmount, a.DebitAmount,
CASE WHEN a.CreatedDate between @Start and @End THEN  sum(a.CreditAmount) ELSE '0' END as  CC ,
CASE WHEN a.CreatedDate between @Start and @End THEN  sum(a.DebitAmount) ELSE '0' END as  DD
 from JournalEntryDetail as a inner join JournalEntry as b on a.JournalEntryId=b.JournalEntryId
 inner join COA as c on a.COAId=c.COAID
 where b.ProdId=@ProdID and AuditStatus='Posted' and c.COACode like '%'+@AccountNumber+'%'
 group by a.COAId,a.VendorName,a.Note, a.CreatedDate,a.CreditAmount,a.DebitAmount

END




GO