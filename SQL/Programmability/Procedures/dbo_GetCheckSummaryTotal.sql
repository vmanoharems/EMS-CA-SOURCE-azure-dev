SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO




CREATE PROCEDURE [dbo].[GetCheckSummaryTotal]    -- exec GetCheckSummaryTotal '1','1','2015-08-01','2016-12-31',54,'',2,'ALL'
(
@CompanyID varchar(50),
@BankID varchar(50),
@Date1 date,
@Date2 date,
@ProdID varchar(50),
@CheckRunIDList varchar(100),
@UserID int,
@ChecKType varchar(50)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	if(@ChecKType='ALL')
	begin
	 set @ChecKType='Check,Manual Check,Wire Check';
	end
	-- Time Zone
	declare @tz varchar(50);

	declare @CheckRunIDLists varchar(500);

	if exists(select * from TimeZone where UserID=@UserID)
	begin
	select @tz=TimeDifference from TimeZone where UserID=@UserID 	
	end
	else
	begin
	set @tz='00:00'
	end 
	-- End Time Zone

	select @CompanyID=CompanyID from Company where ProdID=@ProdID and CompanyCode=@CompanyID;

	 if(@Date1='')
	 begin
	 set @Date1='0001-01-01'
	 end

	  if(@Date2='')
	  begin
	 set @Date2='9999-01-01'
	  end

	if(@CheckRunIDList='')
	begin

	select a.PayBy, count(a.PayBy) as Total, sum(PaidAmount) as Amount from Payment as a 
	inner join CheckRunAddon as b on a.PaymentId=b.PaymentID
 where b.CheckRunID in(

   select a.CheckRunID from CheckRun	as a 
inner join CheckRunAddon as b on a.CheckRunID=b.CheckRunID
inner join Payment as c  on b.PaymentID=c.PaymentId
inner join PaymentLine as d on c.PaymentId=d.PaymentId
inner join Invoice as e on d.InvoiceId=e.Invoiceid

  where a.ProdID=@prodId  and a.StartDate-cast(@tz as datetime) between @Date1 and @Date2 
	  and(a.BankID=@BankID  OR @BankID = '') and(e.CompanyID=@CompanyID  OR @CompanyID = '')
	  and a.Status not in ('working','CANCELED')
	  and c.PayBy in (SELECT items as S1 FROM dbo.SplitId(@ChecKType,','))
	   )

	  group by a.PayBy
     
   end
    else 
    begin
	select a.PayBy,count(a.PayBy) as Total,sum(PaidAmount) as Amount from Payment as a 
	inner join CheckRunAddon as b on a.PaymentId=b.PaymentID
 where b.CheckRunID in(

  select  a.CheckRunID from CheckRun	as a 
inner join CheckRunAddon as b on a.CheckRunID=b.CheckRunID
inner join Payment as c  on b.PaymentID=c.PaymentId
inner join PaymentLine as d on c.PaymentId=d.PaymentId
inner join Invoice as e on d.InvoiceId=e.Invoiceid
  where a.ProdID=@prodId  and a.StartDate between @Date1 and @Date2 
	  and(a.BankID=@BankID  OR @BankID = '') and(e.CompanyID=@CompanyID  OR @CompanyID = '')
	  and a.CheckRunID  in(SELECT items as S1 FROM dbo.SplitId(@CheckRunIDList,','))
	   and c.PayBy in (SELECT items as S1 FROM dbo.SplitId(@ChecKType,','))
	  )
     group by a.PayBy

 end







END 



GO