SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetFringeByProdId] 
@ProdID int
AS
BEGIN
	
	SET NOCOUNT ON;

   
	SELECT * from PayrollFringeHeader where ProdID=@ProdID
END



GO