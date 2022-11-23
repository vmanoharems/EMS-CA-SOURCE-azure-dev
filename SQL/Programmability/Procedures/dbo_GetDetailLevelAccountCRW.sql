SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetDetailLevelAccountCRW]
(
@ProdID int,
@AccountCode varchar(100),
@Mode int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	if(@Mode=1)
	begin

	declare @AccountID int;

	select @AccountID=AccountId from tblAccounts where AccountCode=@AccountCode and ProdId=@ProdID;

	select AccountId,AccountCode,AccountName,Posting from tblAccounts where ParentId=@AccountID and ProdId=@ProdID 
	and Status=1
 end
 else if(@Mode=2)
 begin

 select AccountId,AccountCode,AccountName,Posting from tblAccounts where SegmentType='Set' and ProdId=@ProdID 
	and Status=1

 end
 else if(@Mode=3)
 begin
 select AccountId,AccountCode,AccountName,Posting from tblAccounts where SegmentType='Series' and ProdId=@ProdID 
	and Status=1
 end


END



GO