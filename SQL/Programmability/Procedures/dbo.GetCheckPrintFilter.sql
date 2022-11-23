CREATE PROCEDURE [dbo].[GetCheckPrintFilter]    -- exec GetCheckPrintFilter '','1','2015-08-01','2016-08-31',3,''
(
@CompanyID varchar(50),
@BankID varchar(50),
@Date1 date,
@Date2 date,
@ProdID varchar(50),
@CheckRunIDList varchar(100),
@UserID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

declare @tz INT;
	SET @tz = DBO.TZforProduction(DEFAULT);

	select @CompanyID=CompanyID from Company where ProdID=@ProdID and CompanyCode=@CompanyID;

	 if(@Date1='')
	 begin
	 set @Date1='2017-01-01'
	 end

	  if(@Date2='')
	  begin
	 set @Date2='9999-01-01'
	  end

	if(@CheckRunIDList='')
	begin
	  --select CheckRunID,BankID from CheckRun	
	  --where ProdID=@prodId  and StartDate between @Date1 and @Date2 
	  --and(BankId=@BankID  OR @BankID = '') 
   --   order by CheckRunID

   select distinct a.CheckRunID,a.BankID from CheckRun	as a 
	inner join CheckRunAddon as b on a.CheckRunID=b.CheckRunID
	inner join Payment as c  on b.PaymentID=c.PaymentId
	inner join PaymentLine as d on c.PaymentId=d.PaymentId
	left join Invoice as e on d.InvoiceId=e.Invoiceid
  where a.ProdID=@prodId  and DBO.TZFROMutc( a.StartDate,@tz) between @Date1 and @Date2 
	  and(a.BankID=@BankID  OR @BankID = '') and(e.CompanyID=@CompanyID  OR @CompanyID = '')
	  and a.Status not in ('working','CANCELED*') 
      order by CheckRunID

   end
 else 
 begin

  select distinct a.CheckRunID,a.BankID from CheckRun	as a 
	inner join CheckRunAddon as b on a.CheckRunID=b.CheckRunID
	inner join Payment as c  on b.PaymentID=c.PaymentId
	inner join PaymentLine as d on c.PaymentId=d.PaymentId
	inner join Invoice as e on d.InvoiceId=e.Invoiceid
  where a.ProdID=@prodId  and DBO.TZFROMutc( a.StartDate,@tz) between @Date1 and @Date2 
	  and(a.BankID=@BankID  OR @BankID = '') and(e.CompanyID=@CompanyID  OR @CompanyID = '')
	  and a.CheckRunID  in(SELECT items as S1 FROM dbo.SplitId(@CheckRunIDList,','))
      order by CheckRunID

 end

END
GO