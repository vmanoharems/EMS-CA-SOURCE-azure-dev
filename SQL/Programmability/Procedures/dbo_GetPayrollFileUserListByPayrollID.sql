SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GetPayrollFileUserListByPayrollID]
(
@PayrollFileID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

  select PayrollUserID , LastName+' '+FirstName  as Name,CheckNumber ,TotalPaymentAmount from PayrollUser
   where PayrollFileID=@PayrollFileID

END



GO