SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


-- =============================================
CREATE PROCEDURE [dbo].[FetchCOAbyCOACode]
	
	@COACode nvarchar(200),
	@ProdID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    


select *  from COA  where ParentCode=@COACode and ProdID=@ProdID

END





GO