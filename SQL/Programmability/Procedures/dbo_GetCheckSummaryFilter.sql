CREATE PROCEDURE [dbo].[GetCheckSummaryFilter]    -- exec GetCheckSummaryFilter '01','1','1/1/0001 12:00:00 AM','1/1/9999 12:00:00 AM',60,'',NULL,'ALL'
@CompanyID varchar(50),
@BankID varchar(50),
@Date1 date,
@Date2 date,
@ProdID varchar(50),
@CheckRunIDList varchar(100),
@UserID int,
@ChecKType varchar(50)
AS
BEGIN
	SET NOCOUNT ON;
	if(@ChecKType='ALL')
	begin
		set @ChecKType='Check,Manual Check,Wire Check';
	END
	declare @CheckRunIDLists varchar(500);

	-- Time Zone
declare @tz INT;
	SET @tz = DBO.TZforProduction(DEFAULT);

	-- END Time Zone

	select @CompanyID=CompanyID from Company where ProdID=@ProdID and CompanyCode=@CompanyID;
	if(@Date1='')
	begin
		set @Date1='0001-01-01'
	END
	if(@Date2='')
	begin
		set @Date2='9999-01-01'
	END

	if(@CheckRunIDList='')
	begin
		select distinct a.CheckNo,convert(varchar(10),b.PaymentDate,101) as PaymentDate,
		c.VENDorNumber,c.PrintOncheckAS,'0' as TransactionNumber ,b.PayBy,a.CheckRunID,b.PaidAmount,e.CompanyPeriod,b.Status
		from CheckRunAddon as a 
		inner join Payment as b on a.PaymentID=b.PaymentId
		inner join tblVENDor as c on b.VENDorId=c.VENDorID
		inner join JournalEntry as d on b.PaymentId=d.ReferenceNumber and d.SourceTable='Payment'
		inner join ClosePeriod as e on d.ClosePeriod=e.ClosePeriodId and  d.SourceTable='Payment'
		where a.CheckRunID in(
			select a.CheckRunID from CheckRun	as a 
			inner join CheckRunAddon as b on a.CheckRunID=b.CheckRunID
			inner join Payment as c  on b.PaymentID=c.PaymentId
			inner join PaymentLine as d on c.PaymentId=d.PaymentId
			inner join Invoice as e on d.InvoiceId=e.Invoiceid
			where a.ProdID=@prodId  
			and DBO.TZFROMutc( a.StartDate,@tz) between @Date1 and @Date2 
			and(a.BankID=@BankID  OR @BankID = '') and(e.CompanyID=@CompanyID  OR @CompanyID = '')
			and a.Status not in ('working','CANCELED')
			and c.PayBy in (SELECT items as S1 FROM dbo.SplitId(@ChecKType,','))
		)
		order  by a.CheckNo
	END
	else 
	begin
		select distinct a.CheckNo,convert(varchar(10),b.PaymentDate,101) as PaymentDate
		,c.VENDorNumber,c.PrintOncheckAS, '0' as TransactionNumber,b.PayBy,a.CheckRunID,b.PaidAmount,e.CompanyPeriod,b.Status
		from CheckRunAddon as a 
		inner join Payment as b on a.PaymentID=b.PaymentId
		inner join tblVENDor as c on b.VENDorId=c.VENDorID
		inner join JournalEntry as d on b.PaymentId=d.ReferenceNumber and d.SourceTable='Payment'
		inner join ClosePeriod as e on d.ClosePeriod=e.ClosePeriodId and  d.SourceTable='Payment'
		where a.CheckRunID in(
			select  a.CheckRunID from CheckRun	as a 
			inner join CheckRunAddon as b on a.CheckRunID=b.CheckRunID
			inner join Payment as c  on b.PaymentID=c.PaymentId
			inner join PaymentLine as d on c.PaymentId=d.PaymentId
			inner join Invoice as e on d.InvoiceId=e.Invoiceid
			where a.ProdID=@prodId  and DBO.TZFROMutc( a.StartDate,@tz) between @Date1 and @Date2 
			and(a.BankID=@BankID  OR @BankID = '') and(e.CompanyID=@CompanyID  OR @CompanyID = '')
			and a.CheckRunID  in(SELECT items as S1 FROM dbo.SplitId(@CheckRunIDList,','))
			and c.PayBy in (SELECT items as S1 FROM dbo.SplitId(@ChecKType,','))
		)
		order  by a.CheckNo
	END
END
GO