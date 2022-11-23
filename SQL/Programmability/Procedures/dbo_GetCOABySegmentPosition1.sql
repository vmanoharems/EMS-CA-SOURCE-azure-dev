ALTER PROCEDURE [dbo].[GetCOABySegmentPosition1] -- GetCOABySegmentPosition1 '07|01',14,-1
	-- Add the parameters for the stored procedure here
	@COACode nvarchar(200),
	@ProdId int,
	@SegmentPosition int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	declare @DT varchar(20);
    if (@SegmentPosition = -1) -- Use -1 to return CASH accounts that are not in use by any other entity (bank, custodian, recipient)
		begin
			declare @DetailSegmentLevel int;
			select @DetailSegmentLevel = SegmentLevel from segment where Classification = 'Detail'

			select COA.AccountTypeID, COA.DetailLevel,a.AccountCode as COANo,COACode,COAID ,a.AccountCode+' ('+a.AccountName+')' as COANo1
			from COA 
			Join tblaccounts A
				on COA.AccountId=A.AccountId
			where A.Posting = 1
				and COA.ProdID = @ProdID
				and COA.ParentCode=@COACode
				--and COA.DetailLevel = @DetailSegmentLevel
				and COA.AccountTypeID = 4
				and COAID not in (select COAID from vUsedCOAIDs)
			order by a.AccountCode
			;
		end
	else if(@SegmentPosition=0)
		begin
		select SS1 as COANo,COACode,COAID ,'' as COANo1 from COA  where ss2='' and ProdID=@ProdID
		order by COA.SS1
		end
	else if(@SegmentPosition=1)
		begin
		set @DT=(select classification   from segment where SegmentLevel=2 and Prodid=@ProdID);

		If (@DT='Detail')
			begin
			select a.AccountCode as COANo,COACode,COAID ,a.AccountCode+' ('+a.AccountName+')' as COANo1  from COA inner Join tblaccounts a
			on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1
			order by a.AccountCode
			;
			end
		else
			begin
			select SS2 as COANo,COACode,COAID,'' as COANo1  from COA  where ParentCode=@COACode and ProdID=@ProdID
			order by COA.ss2
			;
			end
		end
	else if(@SegmentPosition=2)
		begin
		set @DT=(select classification   from segment where SegmentLevel=3 and Prodid=@ProdID);
		If (@DT='Detail')
			begin
			select a.AccountCode as COANo,COACode,COAID,a.AccountCode+' ('+a.AccountName+')' as COANo1  from COA inner Join tblaccounts a
			on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1
			order by a.AccountCode
			;
			end
		else
			begin
			select A.AccountCode as  COANo,A.AccountCode as COACode,COAID,A.AccountCode as  as COANo1  
			from COA  
			join tblAccounts A
			on COA.AccountID = A.AccountID
			where COA.ParentCode=@COACode and COA.ProdID=@ProdID
			order by COA.SS3
			end
		end
	else if(@SegmentPosition=3)
		begin
		set @DT=(select classification   from segment where SegmentLevel=4 and Prodid=@ProdID);
		If (@DT='Detail')
			begin
			select a.AccountCode as COANo,COACode,COAID ,a.AccountCode+' ('+a.AccountName+')' as COANo1 from COA inner Join tblaccounts a
			on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1
			order by a.AccountCode
			;
			end
		else
			begin
			select SS4 as COANo,COACode,COAID ,'' as COANo1 from COA  where ParentCode=@COACode and ProdID=@ProdID
			order by COA.SS4
			;
			end
		end
	else if(@SegmentPosition=4)
		begin
		set @DT=(select classification   from segment where SegmentLevel=5 and Prodid=@ProdID);
		If (@DT='Detail')
			begin
			select a.AccountCode as COANo,COACode,COAID  from COA inner Join tblaccounts a
			on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1
			order by a.AccountCode
			;
			end
		else
			begin
			select SS5 as COANo,COACode,COAID ,'' as COANo1 from COA  where ParentCode=@COACode and ProdID=@ProdID
			order by COA.SS5
			;
			end
		end
	else if(@SegmentPosition=5)
		begin
		set @DT=(select classification   from segment where SegmentLevel=6 and Prodid=@ProdID);
		If (@DT='Detail')
			begin
			select a.AccountCode as COANo,COACode,COAID,a.AccountCode+' ('+a.AccountName+')' as COANo1  from COA inner Join tblaccounts a
			on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1
			order by a.AccountCode
			;
			end
		else
			begin
			select SS6 as COANo,COACode,COAID,'' as COANo1  from COA  where ParentCode=@COACode and ProdID=@ProdID
			order by COA.SS6
			end
		end
	else if(@SegmentPosition=6)
		begin
		set @DT=(select classification   from segment where SegmentLevel=7 and Prodid=@ProdID);
		If (@DT='Detail')
			begin
			select a.AccountCode as COANo,COACode,COAID,a.AccountCode+' ('+a.AccountName+')' as COANo1  from COA inner Join tblaccounts a
			on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1
			order by a.AccountCode
			;
			end
		else
			begin
			select SS7 as COANo,COACode,COAID,'' as COANo1  from COA  where ParentCode=@COACode and ProdID=@ProdID
			order by COA.ss7
			end
		end
	else if(@SegmentPosition=7)
		begin
		set @DT=(select classification   from segment where SegmentLevel=8 and Prodid=@ProdID);
		If (@DT='Detail')
			begin
			select a.AccountCode as COANo,COACode,COAID,a.AccountCode+' ('+a.AccountName+')' as COANo1  from COA inner Join tblaccounts a
			on a.AccountId=coa.AccountId   where ParentCode=@COACode and  COA.ProdId=@ProdID and a.Posting=1
			order by a.AccountCode
			;
			end
		else
			begin
			select SS8 as COANo,COACode,COAID,'' as COANo1  from COA  where ParentCode=@COACode and ProdID=@ProdID
			order by COA.ss8
			end
	end

END




GO