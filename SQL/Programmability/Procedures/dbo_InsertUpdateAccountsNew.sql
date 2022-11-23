SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[InsertUpdateAccountsNew]
	-- Add the parameters for the stored procedure here
	@AccountId int,
	@SegmentId int
	,@AccountCode nvarchar(50)
	,@AccountName nvarchar(200)
	,@AccountTypeId int
	,@BalanceSheet bit
	,@Status bit
	,@Posting bit
	,@SubLevel int
	,@SegmentType nvarchar(50)
	,@ParentId int
	,@CreatedBy int
	,@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	if(@SegmentType<>'Ledger' and @SegmentType<>'Detail' )
	begin

	if not exists (select * from TblAccounts where AccountCode=@AccountCode and SegmentType=@SegmentType and AccountId<>@AccountId)
	begin
	if(@AccountId=0)
	 begin
    -- Insert statements for procedure here
	INSERT INTO [dbo].[TblAccounts]([SegmentId],[AccountCode],[AccountName],[AccountTypeId]
           ,[BalanceSheet],[Status],[Posting],[SubLevel],[SegmentType],[ParentId],[CreatedDate]
           ,[CreatedBy],[ProdId])
     VALUES
           (@SegmentId,@AccountCode,@AccountName,@AccountTypeId,@BalanceSheet,@Status,@Posting,@SubLevel,@SegmentType,@ParentId,GETDATE(),
		   @CreatedBy,@ProdId)

		   set @AccountId= SCOPE_IDENTITY ()

		   end
		   else
		   begin
		   	update TblAccounts set AccountCode=@AccountCode,AccountName=@AccountName,
			BalanceSheet=@BalanceSheet,Status=@Status,ParentId=@ParentId 

		  where AccountId=@AccountId
		   end

		  

		   end
		   else
		   begin
		   set @AccountId=-1;
		   end

		   end
		   else if (@SegmentType='Ledger')
		   begin

		   	if not exists (select * from LedgerAccounts where AccountCode=@AccountCode and SegmentType=@SegmentType and LedgerId<>@AccountId)
	begin
	if(@AccountId=0)
	 begin
    -- Insert statements for procedure here
	INSERT INTO [dbo].LedgerAccounts([SegmentId],[AccountCode],[AccountName],[AccountTypeId]
           ,[BalanceSheet],[Status],[Posting],[SubLevel],[SegmentType],[ParentId],[CreatedDate]
           ,[CreatedBy],[ProdId])
     VALUES
           (@SegmentId,@AccountCode,@AccountName,@AccountTypeId,@BalanceSheet,@Status,@Posting,@SubLevel,@SegmentType,@ParentId,GETDATE(),
		   @CreatedBy,@ProdId)

		   set @AccountId= SCOPE_IDENTITY ()

		   end
		   else
		   begin
		   	update LedgerAccounts set AccountCode=@AccountCode,AccountName=@AccountName,
			BalanceSheet=@BalanceSheet,Status=@Status

		  where LedgerId=@AccountId
		   end

		  

		   end

		   else if (@SegmentType='Detail')


		   begin
		   if not exists (select * from TblAccounts where AccountCode=@AccountCode and SegmentType=@SegmentType and Sublevel=@SubLevel
		   and ParentId=@ParentId and AccountId<>@AccountId)
	begin
	if(@AccountId=0)
	 begin
    -- Insert statements for procedure here
	INSERT INTO [dbo].[TblAccounts]([SegmentId],[AccountCode],[AccountName],[AccountTypeId]
           ,[BalanceSheet],[Status],[Posting],[SubLevel],[SegmentType],[ParentId],[CreatedDate]
           ,[CreatedBy],[ProdId])
     VALUES
           (@SegmentId,@AccountCode,@AccountName,@AccountTypeId,@BalanceSheet,@Status,@Posting,@SubLevel,@SegmentType,@ParentId,GETDATE(),
		   @CreatedBy,@ProdId)

		   set @AccountId= SCOPE_IDENTITY ()

		   end
		   else
		   begin
		   	update TblAccounts set AccountCode=@AccountCode,AccountName=@AccountName,
			BalanceSheet=@BalanceSheet,Posting=@Posting,AccountTypeId=@AccountTypeId,Status=@Status,ParentId=@ParentId 

		  where AccountId=@AccountId
		   end

		   end
		   else
		   begin
		   set @AccountId=-1;
		   end

		   end
		    select @AccountId;

			end
			end




GO