
SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetBankInfoList] -- GetBankInfoList 60
	-- Add the parameters for the stored procedure here
	@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select b.BankId,b.Bankname,c.CurrencyName,b.PostiivePay,co.CompanyCode
	,isnull(CS.StartNumber,'-')as StartNumber,isnull(CS.EndNumber,'-') as EndNumber,isnull(NC.NextCheckNumber,-1) as NextCheckNumber
	 from BankInfo B
	left outer join CheckSetting CS on cs.BankID=B.BankId
	left outer join Currecny C on c.CurrencyID=b.CurrencyID
	left outer join Company CO on co.CompanyID=b.CompanyId
	left join (
			select BankID, max(cast(CheckNumber as int))+ 1 as NextCheckNumber
			from Payment P
			join (select max(PaymentID) as PaymentID from Payment where PayBy in ('Check','Manual Check') 			and try_cast(CheckNumber as int) is not null) as MP
				on P.PaymentID = MP.PaymentID
			group by BankID
			) as NC on B.BankID = NC.BankID
	where b.Prodid=@ProdId
END

GO