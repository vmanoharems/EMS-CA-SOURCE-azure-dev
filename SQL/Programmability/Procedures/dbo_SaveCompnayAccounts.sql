SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[SaveCompnayAccounts] -- SaveCompnayAccounts 1,3
	-- Add the parameters for the stored procedure here
	@CreatedBy int,
	@ProdId int,
	@ACCountCode nvarchar(50),
	@AccountName nvarchar(50)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	if not exists(select * from TblAccounts where AccountCode=@ACCountCode and SegmentType='Company' and ProdId=@ProdId)
	begin
	  insert into TblAccounts(SegmentId,AccountCode,AccountName,Status,SegmentType,CreatedDate,CreatedBy,ProdId)
  values( 1 ,@ACCountCode,@AccountName,1,'Company',getdate(),@CreatedBy,@ProdId) 
	end



	
END






GO