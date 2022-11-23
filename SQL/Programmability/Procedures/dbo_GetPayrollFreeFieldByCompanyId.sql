SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetPayrollFreeFieldByCompanyId]
	@CompanyId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	 select PayrollFreeFieldID, FreeField1,FreeField2,FreeField3,T1.TransCode as FF1Val,T2.TransCode as FF2Val, T3.TransCode as FF3Val
  from PayrollFreeField a, TransactionCode T1 ,TransactionCode T2 ,TransactionCode T3
  where a.FreeField1=T1.TransactionCodeID and a.FreeField2=T2.TransactionCodeID and a.FreeField3=T3.TransactionCodeID
  and a.CompanyId=@CompanyId
END



GO