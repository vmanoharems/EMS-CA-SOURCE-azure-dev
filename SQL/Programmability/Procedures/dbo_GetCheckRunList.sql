SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO



 CREATE PROCEDURE [dbo].[GetCheckRunList] 
(
@ProdID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

 select CheckRunID,BankID from CheckRun where Status not in ('working','CANCELED') and ProdID=@ProdID
 order by CheckRunID

END


GO