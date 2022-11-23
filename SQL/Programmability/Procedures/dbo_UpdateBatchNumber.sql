SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[UpdateBatchNumber] -- UpdateBatchNumber 'acs123456',1,3
	-- Add the parameters for the stored procedure here
	@BatchNumber nvarchar(12),
	@UserId int,
	@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	

	update BatchNumbers set Status=0,InactiveDate=GETDATE() where UserId=@UserId and ProdId=@ProdId;
	insert into BatchNumbers values(@UserId,@ProdId,@BatchNumber,GETDATE(),null,1)
	select @BatchNumber;
END



GO