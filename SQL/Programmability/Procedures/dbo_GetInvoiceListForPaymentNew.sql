SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GetInvoiceListForPaymentNew] -- GetInvoiceListForPaymentNew 3,1,'01','','','','Both'
(
@prodId int,
@BankId int,
@CompanyCode varchar(50),
@VendorID varchar(50),
@InvDate1 date,
@InvDate2 date,
@Period varchar(50)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @CID int;

	select @CID=CompanyID from Company where CompanyCode=@CompanyCode and ProdID=@prodId;

	 
	 if(@InvDate1='')
	 begin
		 set @InvDate1='0001-01-01'
	 end

	  if(@InvDate2='')
	 begin
		 set @InvDate2='9999-01-01'
	 end


 declare @PrId1 int,@PrId2 int
	set @PrId1=0;set @PrId2=0;
	if(@Period='Current')
	begin
		set @PrId1= dbo.GetCurrentOpenPeriodID(@CID,DEFAULT); --(select ClosePeriodId  from ClosePeriod  where CompanyId=@CID and Status='Open' and PeriodStatus='Current')
	end
	else if(@Period='Future')
	begin
		set @PrId2=(select ClosePeriodId  from ClosePeriod  where CompanyId=@CID and Status='Open' and PeriodStatus='Future')
	end
	else if(@Period='Both')
	begin
		set @PrId1=(select isnull(ClosePeriodId,0)  from ClosePeriod  where CompanyId=@CID and Status='Open' and PeriodStatus='Current')
		set @PrId2=(select isnull(ClosePeriodId,0)  from ClosePeriod  where CompanyId=@CID and Status='Open' and PeriodStatus='Future')
	end


	select I.Invoiceid,i.InvoiceNumber,convert(varchar(10),i.InvoiceDate,101) As InvoiceDate,i.OriginalAmount,
	v.VendorName,i.VendorID from Invoice I
	inner join tblVendor V on v.VendorID=I.VendorID
	join vUnpaidInvoices P on I.InvoiceID = P.InvoiceID
	
	where I. ProdID=@prodId and i.BankId=@BankId and i.InvoiceStatus='Posted' and I.CompanyID=@CID
	and (i.VendorID=@VendorID  OR @VendorID = '') and i.InvoiceDate between @InvDate1 and @InvDate2 
	and (I.ClosePeriodId <=@PrId1 or I.ClosePeriodID=@PrId2)
	 order by v.VendorName   



END
GO