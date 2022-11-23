SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[CheckLedgerExistance]
	-- Add the parameters for the stored procedure here
	@DetailCode nvarchar(50)
	,@ParentId int,
	@Sublevel int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	
	select * from TblAccounts where AccountCode=@DetailCode and SegmentType='Detail' and ParentId=@ParentId and sublevel=@Sublevel



	
END




GO