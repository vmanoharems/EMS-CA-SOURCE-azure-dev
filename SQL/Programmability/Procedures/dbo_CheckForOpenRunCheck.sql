SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[CheckForOpenRunCheck]   -- CheckForOpenRunCheck 1,54
(
@BankID int,
@ProdID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	
	
 select a.CheckRunID, a.Status,b.Bankname ,c.Name,c.UserID from CheckRun as a inner join BankInfo as b
 on a.BankID=b.BankId
 inner join CAUsers as c on a.UserID=c.UserID
  where a.BankID=@BankID and a.ProdID=@ProdID and a.Status='WORKING'




END


GO