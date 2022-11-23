SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE  [dbo].[ReportsBankingCheckRunRegReportJSON]
 @JSONparameters nvarchar(max)
AS
BEGIN

 SET NOCOUNT ON;

 -- declare @JSONparameters nvarchar(max)='{"BankingCheckRunFilterCompany":["1"],"BankingCheckRunFilterLocation":null,"BankingCheckRunFilterSet":null,"BankName":"","hdnBank":"","From":"","To":"","CheckRun":{"callPayload":"{\"Filter\":\"1||||\",\"ProdID\":\"14\",\"ProName\":\"EMS-Feature\",\"UserID\":\"59\"}"},"ProdId":"14","UserId":"59"}';  
 -- exec ReportsBankingCheckRunRegReportJSON '{"BankingCheckRunFilterCompany":["1"],"BankingCheckRunFilterLocation":null,"BankingCheckRunFilterSet":null,"BankName":"","hdnBank":"","From":"","To":"","CheckRun":{"callPayload":"{\"Filter\":\"1||||\",\"ProdID\":\"14\",\"ProName\":\"EMS-Feature\",\"UserID\":\"59\"}"},"ProdId":"14","UserId":"59"}'; 

declare @CompanyID varchar(50)=Replace(Replace(Replace(isnull(JSON_query(@JSONparameters,'$.BankingCheckRunFilterCompany'),''),'[',''),']',''),'"','');
declare @BankID varchar(50)= isnull(JSON_value(@JSONparameters,'$.ProdId'),-1);
declare @Date1 date = isnull(json_value(@JSONparameters,'$.VendorCreatedFrom'),'1900-01-01');
declare @Date2 date= isnull(JSON_value(@JSONparameters,'$.VendorCreatedTo'),getdate());
declare @ProdID varchar(50) = isnull(JSON_value(@JSONparameters,'$.ProdId'),-1);
declare @CheckRunIDList varchar(100)= isnull(JSON_value(@JSONparameters,'$.CheckRunIDList'),'');
declare @UserID int= isnull(JSON_value(@JSONparameters,'$.UserId'),'');


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