SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[BankRegisterHeader]  -- exec BankRegisterHeader 1,1
(
@CompanyID int,
@BankId int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

   select a.CompanyName,b.AccountCode,b.BankId from Company as a
   left join AccountClearing as b on a.CompanyID=b.CompanyId
   where a.CompanyID=@CompanyID  and b.BankId=@BankId and b.AccountName='CashAccount'

  
END



GO