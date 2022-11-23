SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[ReconcilationListForReport]    -- exec ReconcilationListForReport 1,2,2
(
@CompanyID varchar(50),
@BankID varchar(50),
@RecID varchar(50)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	select a.ReconcilationID,a.BankID,a.Status from BankReconcilation 
    as a inner join 
	BankInfo as b on a.BankID=b.BankId

	where (a.BankId=@BankID  OR @BankID = '') 
	--and(b.CompanyId=@CompanyID  OR @CompanyID = '')
	and (a.ReconcilationID=@RecID  OR @RecID = '') and a.Status='Completed'
	 
END




GO