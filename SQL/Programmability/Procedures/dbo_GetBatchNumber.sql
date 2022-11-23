SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
/*alter table BatchNumbers 
ADD CONSTRAINT AK_UserBatch UNIQUE (UserID, BatchNumber); 
*/
CREATE PROCEDURE [dbo].[GetBatchNumber] -- GetBatchNumber 60,75
(
	@ProdId int,
	@UserId int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	declare @BatchNo nvarchar(12) = null;
	declare @UserName nvarchar(10)= '';
	declare @BatchId int = null;
	declare @Status bit = 0;
	declare @tz  int = dbo.tzforproduction(0);
	declare @CreateDate as date = null;
	declare @tzDate as date = convert(varchar(10), (cast(dbo.TZfromUTC(GETDATE(),@tz) as date)), 111);

print 'Here is the start UserName:' + @UserName + ',tz:' + cast(@tz as varchar(max)) + ',tzDate:' + cast(@tzDate as varchar(max))

begin transaction
-- First check to see if there exists an open batch number for today
	select @BatchNo = BatchNumber
		, @BatchID = BatchID
		, @CreateDate =  convert(varchar(10), cast(dbo.TZfromUTC(CreateDate,@tz) as date), 111)
	from BatchNumbers
	where Userid=@UserId 
	and ProdId=@ProdId 
	and Status=1
	;
--	set @CreateDate = getdate();
	print 'tzDate: ' + cast(@tzDate as varchar(max)) + ', CreateDate: ' +isnull(cast(@CreateDate as varchar(max)),'');
	
	if (@tzDate = @CreateDate) -- This means we have an active batch with today's date
		begin
			select @BatchNo
			COMMIT TRANSACTION;
			return; -- Return if there is already a current batch
		end
	ELSE -- This means we have no active batch for this user.
	begin
		select @UserName=case when Name is null then Email when name ='' then email else Name end
		from CAUsers
		where UserID=@UserId and ProdID=@ProdId;
		print 'Here is the selected UserName:' + @UserName;

		if (@UserName = '' or @UserName is null)
			begin -- Check (using remote DB connection) if this is a Super User who has not been assigned to the Production
				print 'User was not found in CAUsers:' + @UserName;
				select top 1 @UserName = email
					from dbo.[UserProduction] RUP
					join dbo.CAUserAdmin CUA on RUP.Userid = CUA.UserID 
					where CUA.UserID=@UserId and RUP.ProdID = @ProdID
					and CUA.[AdminFlag] = 1;
				if @@rowcount = 0 
					begin
						print 'No Access granted';
						rollback;
						return;
					end
				else
					begin
						print 'Access granted for EMS';
					end
			end

		set @UserName = (
			SELECT SUBSTRING(@UserName, 1, 1) 
				+ SUBSTRING(@UserName, CHARINDEX(' ', @UserName) + 1, 1)
				+ CASE WHEN 0 <> CHARINDEX(' ', @UserName, CHARINDEX(' ', @UserName) + 1)
					THEN SUBSTRING(@UserName, CHARINDEX(' ', @UserName, CHARINDEX(' ', @UserName) + 1) + 1, 1) 
					ELSE ''
					END)
				+ RIGHT(REPLACE(cast(@tzDate as varchar(10)),'-',''),6);
		print 'New Batch #:' + @UserName;

		merge dbo.BatchNumbers as B
		using (select @UserName as BatchNumber) as UI
		on B.BatchNumber = UI.BatchNumber and B.Userid=@Userid and B.Prodid = @Prodid --and Status=1
		WHEN MATCHED and [Status]=0 then
			update set Status=1
		WHEN NOT MATCHED then
			insert (UserId,ProdId,BatchNumber,CreateDate,Status) values(@UserId,@ProdId,@UserName,GETDATE(),1)
		;

		select @UserName
	end

	commit transaction
END
GO