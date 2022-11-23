SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[ComplateCheckRun]
(
@CheckRunID int,
@ProdId int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

 Update CheckRun set  Status='COMPLETED',EndDate=CURRENT_TIMESTAMP where CheckRunID=@CheckRunID and ProdID=@ProdId;
 Update CheckRunAddon set  Status='COMPLETED' where CheckRunID=@CheckRunID ;
 update CheckRunStatus set Status='COMPLETED'  where ActualCheckRunID=@CheckRunID;


END


GO