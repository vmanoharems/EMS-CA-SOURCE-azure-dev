SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[getDetailAccount]   --- getDetailAccount 5
(
@ProdID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	select AccountCode,AccountId from TblAccounts where SegmentType='Detail' order by accountCode

END
GO